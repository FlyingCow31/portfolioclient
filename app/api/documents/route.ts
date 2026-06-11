import {NextRequest, NextResponse} from "next/server";
import {AdminCheck, AuthUser} from "@/app/lib/auth";
import {list, put} from "@vercel/blob";
import {sql} from "@/app/lib/db";


export async function POST(request: NextRequest) {
    console.log('ça arrive')
    if (!AdminCheck(request)) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    console.log('ça passe')
    const formData = await request.formData();
    console.log('ça recupère le form')
    const file = formData.get('file') as File;
    console.log('ça File')

    const userId = formData.get('userId') as string;
    console.log('ça récupères le file')
    const fileName = file.name;

    const blob = await put(file.name, file, {
        access: 'private',
        contentType: 'application/pdf'
    });

    console.log(blob.url);
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
