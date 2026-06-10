
import {NextRequest, NextResponse} from "next/server";
import {sql} from "@/app/lib/db";
import {AdminCheck, AuthUser} from "@/app/lib/auth";


export async function GET(request: NextRequest, { params }: { params: Promise<{projectId: string}> }) {
        const user = AuthUser(request);
        if (!user) return NextResponse.json({error: "Unauthorized"}, { status: 401});
        const { projectId } = await params;



        if (user.role !== 'admin') {
            const project = await sql`
                SELECT * 
                FROM projects 
                WHERE id = ${projectId}
                AND user_id = ${user.id}
            `;

            if (!project[0]) return NextResponse.json({error: 'Forbidden'}, { status: 403});
        }

        const updates = await sql`
            SELECT * FROM updates
            WHERE project_id = ${projectId}
            ORDER BY created_at ASC
        `;

        return NextResponse.json(updates);
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }>}): Promise<NextResponse> {

    if (!AdminCheck(request)) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const { projectId } = await params;
    if (!projectId) return NextResponse.json({success: false});

    const { name, error, error_name, planned, date } = await request.json();


    try {
        await sql`
        INSERT INTO updates (project_id, name, error, error_name, planned, date)
        VALUES (${projectId}, ${name}, ${error}, ${error_name}, ${planned}, ${date})
        `;

        return NextResponse.json({success: true});
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({success: false});
    }
}


