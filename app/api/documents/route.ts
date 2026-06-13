import {NextRequest, NextResponse} from "next/server";
import {AdminCheck, AuthUser} from "@/app/lib/auth";
import {put} from "@vercel/blob";
import {sql} from "@/app/lib/db";

// Admin only, sends a document on the blob, then sends the URL on the database to be accessed quicker
export async function POST(request: NextRequest) {

    if (!AdminCheck(request)) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    const userId = formData.get('userId') as string;
    const fileName = file.name;

    const blob = await put(file.name, buffer, {
        access: 'public',
        contentType: file.type || 'application/pdf',
        addRandomSuffix: true,
    });


    const url = blob.url;

    try {
        await sql`
            INSERT INTO documents (user_id, name, url)
            VALUES (${userId}, ${fileName}, ${url})
        `;
        return NextResponse.json({status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Error"}, {status: 500});
    }
}


// get the documents either with the user.id (client) or with the userId (admin)
export async function GET(request: NextRequest) {

    const user = AuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized"}, {status: 401});


    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (user.role === 'admin' && userId) {

        const documents = await sql`
            SELECT * FROM documents WHERE user_id = ${userId}
        `;
        return NextResponse.json(documents);
    } else {
        const documents = await sql`
            SELECT * FROM documents WHERE user_id = ${user.id} 
        `;
        return NextResponse.json(documents);
    }
}
