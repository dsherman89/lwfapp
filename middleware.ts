import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (path.startsWith("/login")) return true;

      if (path.startsWith("/admin")) return (token as any)?.role === "ADMIN";

      if (path.startsWith("/matches")) return !!token;

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/matches/:path*", "/login"],
};
