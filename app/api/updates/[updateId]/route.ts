import {NextRequest, NextResponse} from "next/server";
import {AdminCheck} from "@/app/lib/auth";
import {sql} from "@/app/lib/db";






export async function DELETE(request: NextRequest, {params}: {params: Promise<{updateId: string}>}) {

    if (!AdminCheck(request)) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const { updateId } = await params;
    if (!updateId) return NextResponse.json({success: false});

    try {
        await sql`
        DELETE FROM updates WHERE id = ${updateId}
    `;
        return NextResponse.json({success: true});
    } catch (error) {
        console.log("Error with the delete function", error);
        return NextResponse.json({success: false});
    }
}