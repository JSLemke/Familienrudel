import { updateSession } from './src/utils/supabase/middleware';

export async function middleware(request) {
  return await updateUser(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
