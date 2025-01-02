import { NextRequest, NextResponse } from "next/server";

import { currentUser } from "./app/_shared/actions/users/current-user";

const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const user = await currentUser();

  if (authRoutes.includes(pathName)) {
    if (user) {
      return NextResponse.redirect(new URL("/chats", request.url));
    }

    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (assets files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
