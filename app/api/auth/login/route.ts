
import { NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    const {username, password} = await request.json();

    if (!username || !password) {
        return NextResponse.json({error: "An info is missing!"}, {status: 400});
    }

    // Comparison between password and hashed version
    const PasswordCheck = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
    if (username !== process.env.ADMIN_USER || !PasswordCheck) {
        return NextResponse.json({error: "Wrong Credentials"}, {status: 401});
    }

    // Token generation if everything is good
    const role = username === process.env.ADMIN_USER ? 'admin' : 'client';
    const token = jwt.sign({username, role}, process.env.JWT_SECRET!, { expiresIn: `1h`});

    const response = NextResponse.json({success: true});

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60
    });

    // return the token so that middleware can do its things
    return response;
}


