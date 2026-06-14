
import { NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import {sql} from '@/app/lib/db';
import {redis} from "@/app/lib/redis";
import {z} from "zod";

const loginSchema = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(255),
});

// login form form
export async function POST(request: Request) {
    // Zod check & safecheck
    const result = loginSchema.safeParse(await request.json());

    if (!result.success) {
        return NextResponse.json({error: result.error}, {status: 400});
    }
    const {username, password} = result.data;

    // rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const key = `login_attempts:${ip}`;
    const attempts = await redis.get<number>(key) ?? 0;
    console.log(attempts);
    if (attempts >= 5) {
        return NextResponse.json({error: "Rate Limited, try again in 15 minutes"}, {status: 429});
    }





    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];
    const hash = user?.password ?? process.env.HASH_USER;
    const PasswordCheck = await bcrypt.compare(password, hash);

    if (!user || !PasswordCheck) {
        await redis.set(key, attempts + 1, { ex: 60 * 15});
        return NextResponse.json({error: "Wrong Credentials"}, {status: 401});
    }








    // Token generation if everything is good
    const role = user.role;
    const token = jwt.sign({id: user.id, username, role}, process.env.JWT_SECRET!, { expiresIn: `24h`});

    const response = NextResponse.json({success: true});

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
    });

    // return the token so that middleware can do its things && resets the rate limiting
    await redis.del(key);
    return response;
}


