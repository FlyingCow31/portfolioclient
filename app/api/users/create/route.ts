import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {sql} from "@/app/lib/db";
import {AdminCheck} from "@/app/lib/auth";

// Create a user for admin route
export async function POST(request: NextRequest) {

    if (!AdminCheck(request)) return NextResponse.json({error: "Unauthorized"}, {status: 401});


    const { username, password, role, contact } = await request.json();
    if (!username || !password) return NextResponse.json({error: "Credentials missing"}, {status: 400});

    const hash = await bcrypt.hash(password, 10);

    await sql`INSERT INTO users (username, password, role, contact) VALUES (${username}, ${hash}, ${role}, ${contact})`;
    return NextResponse.json({success: true});
}