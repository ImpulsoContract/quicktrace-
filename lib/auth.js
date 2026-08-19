import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "./mail";
import { headers } from "next/headers";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        impersonationToken: { label: "Impersonation Token", type: "text" }
      },
      async authorize(credentials) {
        // Soporte para Impersonate (Suplantación)
        if (credentials?.impersonationToken) {
          try {
            const [timestamp, targetUserId, hash] = credentials.impersonationToken.split(':');
            const now = Date.now();
            
            // Expiración de 1 minuto para el token
            if (now - parseInt(timestamp) > 60000) {
              console.error("[Auth] Impersonation token expired");
              return null;
            }
            
            if (!process.env.NEXTAUTH_SECRET) {
              console.error("[Auth] Missing NEXTAUTH_SECRET in environment");
              return null;
            }
            const expectedHash = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET)
              .update(`${timestamp}:${targetUserId}`)
              .digest('hex');
              
            if (hash !== expectedHash) {
              console.error("[Auth] Invalid impersonation hash");
              return null;
            }
            
            const user = await prisma.user.findUnique({
              where: { id: parseInt(targetUserId) }
            });
            
            if (!user) return null;
            
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            };
          } catch (err) {
            console.error("[Auth] Impersonation error:", err);
            return null;
          }
        }

        if (!credentials?.email || !credentials?.password) return null;

        const normalizedEmail = credentials.email.toLowerCase();
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
          });

          if (!user) {
            await sendLoginErrorEmail(normalizedEmail, "Usuario no encontrado");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            await sendLoginErrorEmail(normalizedEmail, "Contraseña incorrecta");
            return null;
          }

          // Registrar último acceso
          try {
            const locale = credentials?.locale || 'es';
            if (!user.lastLogin && user.role === "CLIENT") {
              const { assignClientifyTagByEmail } = await import("./clientify");
              await assignClientifyTagByEmail(user.email, "quicktrace login");
            }
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                lastLogin: new Date(),
                lastLoginLanguage: locale
              }
            });
          } catch (e) {
            console.error("No se pudo actualizar el lastLogin", e);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("Login authorization error:", error);
          await sendLoginErrorEmail(normalizedEmail, `Error interno del servidor / Base de datos: ${error.message}`, error.stack);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        
        // Si el usuario es cliente, buscar su profileId
        if (user.role === "CLIENT") {
          const profile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
          });
          if (profile) {
            token.profileId = profile.id;
          }
        } 
        // Si el usuario es trabajador, buscar su profileId y permisos
        else if (user.role === "WORKER") {
          const worker = await prisma.worker.findUnique({
            where: { userId: user.id }
          });
          if (worker) {
            token.profileId = worker.clientProfileId;
            token.workerId = worker.id;
            token.permissions = {
              hasTraceability: worker.hasTraceability,
              hasCleaning: worker.hasCleaning,
              hasTemperatures: worker.hasTemperatures,
              hasWater: worker.hasWater,
              hasGoods: worker.hasGoods
            };
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileId = token.profileId;
        session.user.workerId = token.workerId || null;
        session.user.permissions = token.permissions || null;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

async function sendLoginErrorEmail(email, reason, errorStack = null) {
  try {
    let clientIpAddress = "Desconocido";
    let userAgent = "Desconocido";
    try {
      const headersList = headers();
      clientIpAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || clientIpAddress;
      userAgent = headersList.get('user-agent') || userAgent;
    } catch (e) {
      console.error("[Auth Alert] Failed to read request headers:", e);
    }

    await sendEmail({
      to: process.env.SUPPORT_ALERT_EMAIL || "soporte@quicktrace.es",
      subject: `⚠️ [Alerta de Login] Fallo de Autenticación`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 0.5rem;">Intento de Inicio de Sesión Fallido</h2>
          <p>Se ha registrado un fallo al intentar iniciar sesión en QuickTrace:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Email Intentado:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Motivo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #dc2626; font-weight: bold;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Dirección IP:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${clientIpAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Navegador/Dispositivo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">${userAgent}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Fecha:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString('es-ES')}</td>
            </tr>
          </table>
          ${errorStack ? `
            <h3 style="margin-top: 1.5rem; color: #dc2626; border-bottom: 1px solid #fca5a5; padding-bottom: 0.25rem;">Stack Trace del Error:</h3>
            <pre style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #b91c1c; overflow-x: auto;">${errorStack}</pre>
          ` : ''}
        </div>
      `
    });
  } catch (err) {
    console.error("[Auth Alert] Failed to send login error email:", err);
  }
}
