import {NextRequest, NextResponse} from "next/server";

import {sql} from "@/app/lib/db";
import {AdminCheck} from "@/app/lib/auth";


export async function GET(request: NextRequest) {
    if (!AdminCheck(request)) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const users = await sql`
    SELECT 
        users.id,
        users.username,
        users.contact,
        users.role,
        projects.title AS project_title,
        projects.id AS project_id,
        MAX(updates.created_at) AS last_activity
    FROM users
    LEFT JOIN projects ON projects.user_id = users.id
    LEFT JOIN updates ON updates.project_id = projects.id
    GROUP BY users.id, users.username, users.contact, users.role, projects.title, projects.id
    `;

    return NextResponse.json(users);
}