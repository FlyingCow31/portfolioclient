import {NextRequest, NextResponse} from "next/server";
import {AdminCheck} from "@/app/lib/auth";
import {sql} from "@/app/lib/db";
import {del} from "@vercel/blob";


export async function DELETE(request: NextRequest, { params } : { params : Promise<{documentId: string}>}) {
    if (!AdminCheck(request)) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const { documentId } = await params;
    const documents = await sql`
        SELECT * FROM documents WHERE id = ${documentId}
    `;

    const document = documents[0];
    const url = document.url;

    try {
        await del(url);
        console.log('Document supprimé de Blob');

        await sql`
            DELETE FROM documents WHERE id = ${documentId}
        `;
        return NextResponse.json({success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false});
    }
}