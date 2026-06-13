
import { NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import {sql} from '@/app/lib/db';


// login form form
export async function POST(request: Request) {
    const {username, password} = await request.json();
    if (!username || !password) {
        return NextResponse.json({error: "An info is missing!"}, {status: 400});
    }

    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];

    if (!user) {
        return NextResponse.json({ error: "Wrong Credentials" }, { status: 401 });
    }



    // Comparison between password and hashed version
    const PasswordCheck = await bcrypt.compare(password, user.password);
    if (!PasswordCheck) {
        return NextResponse.json({error: "Wrong Credentials"}, {status: 401});
    }


    // Token generation if everything is good
    const role = user.role;
    const token = jwt.sign({id: user.id, username, role}, process.env.JWT_SECRET!, { expiresIn: `24h`});

    const response = NextResponse.json({success: true});

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
    });

    // return the token so that middleware can do its things
    return response;
}


