import {NextRequest, NextResponse} from "next/server";
import {AuthUser} from "@/app/lib/auth";
import {sql} from "@/app/lib/db";

// get the projects of one user
export async function GET(request: NextRequest) {
    const user = AuthUser(request)!;
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');



    if (user.role === 'admin' && userId) {
    const projects = await sql`
        SELECT * FROM projects WHERE user_id = ${userId}
    `;
    return NextResponse.json(projects);
    } else if (user.role === 'client') { // returns only the project of the client
        const projects = await sql`
            SELECT * FROM projects
            WHERE user_id = ${user.id}
        `;
        return NextResponse.json(projects);
    }
    // Possibility to add a general overview of projects here with only admin role and without sending userId.
}


