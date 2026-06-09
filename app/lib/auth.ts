
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function AdminCheck(request: NextRequest): boolean {
    const token = request.cookies.get('token')?.value;
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { role: string };
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}

export function AuthUser(request: NextRequest): { id: number, role: string } | null {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as unknown as { id: number, role: string};
    } catch {
        return null
    }
}