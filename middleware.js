import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");
    const isClientPage = req.nextUrl.pathname.startsWith("/dashboard");
    const isClientApi = req.nextUrl.pathname.startsWith("/api/client");

    if ((isAdminPage || isAdminApi) && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if ((isClientPage || isClientApi) && token?.role !== "CLIENT" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*", "/api/client/:path*"],
};
