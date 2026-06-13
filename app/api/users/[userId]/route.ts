import {NextRequest, NextResponse} from "next/server";
import {sql} from "@/app/lib/db";
import {AdminCheck} from "@/app/lib/auth";
import {del} from "@vercel/blob";


export async function DELETE(request: NextRequest, { params }: { params: Promise<{userId: string}> }) {

    if (!AdminCheck(request)) return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    const { userId } = await params;

    try {
        const documents = await sql`SELECT url FROM documents WHERE user_id = ${userId}`;


        for (const doc of documents) {
            await del(doc.url);
        }


        await sql`
            DELETE FROM users WHERE id = ${userId}
        `;
        return NextResponse.json({success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false});
    }
}