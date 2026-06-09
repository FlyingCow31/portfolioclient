import { NextRequest} from "next/server";
import { NextResponse} from "next/server";
import { jwtVerify } from "jose";


export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // anti-loop
    if (!token) {
        if (pathname === '/') {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    try {
        // Jose things
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const role = payload.role as string;


        // auto-redirection if the token is valid
        if (pathname === '/') {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else {
                return NextResponse.redirect(new URL('/panel', request.url));
            }
        }

        // first connection thing
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/panel', request.url));
        }
        if (pathname.startsWith('/panel') && role !== 'client') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log('retour à la racine:' + error);
        return NextResponse.redirect(new URL('/', request.url));

    }
}
// Security coverage
export const config = {
    matcher: ['/','/panel/:path*', '/admin/:path*']
}

