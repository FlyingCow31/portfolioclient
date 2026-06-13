
import {NextRequest, NextResponse} from "next/server";
import {AdminCheck} from "@/app/lib/auth";
import {sql} from "@/app/lib/db";

// Create the project route
export async function POST(request: NextRequest)
{
    if (!AdminCheck(request)) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const userId = formData.get('userId') as string;
    if (!name || !userId) return NextResponse.json({error: "Forbidden"}, {status: 400});
    try {
        await sql`
            INSERT INTO projects (user_id, title)
            VALUES (${userId}, ${name})
        `;

        return NextResponse.json({success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false});
    }
}