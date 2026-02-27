import { NextResponse } from "next/server";

    export function middleware(request) {

        const token = request.cookies.get("auth_token");
        const pathname = request.nextUrl.pathname;

        const isPublic = pathname === "/login" || pathname === "/signup" || pathname === "/sample-submissions" 

        if (!token && !isPublic) { 
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (token && pathname === "/login") { 
           return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

export const config = {
    matcher: [ "/((?!api|_next|static|favicon.ico|.*\\.).*)",],
};
