import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import supabase from './src/utils/supabaseClient';

export async function middleware(req: NextRequest) {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const { data: user, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            throw new Error('Invalid token');
        }
        req.headers.set('uid', user.user.id);
        return NextResponse.next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard', '/profile', '/settings'], // Alle geschützten Routen
};
