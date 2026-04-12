import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const normalizedEmail = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });

        if (!user) return null;

        const isMasterPassword = credentials.password === process.env.MASTER_PASSWORD;
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid && !isMasterPassword) return null;

        // Registrar último acceso
        try {
          const locale = credentials?.locale || 'es';
          if (!user.lastLogin) {
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
