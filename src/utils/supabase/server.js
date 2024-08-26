// src/utils/supabase/server.js

import { createServerClient } from '@supabase/ssr';

export function createClient(req, res) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            request: req,
            response: res,
            cookies: {
                getAll: () => req.cookies.getAll(),
                setAll: (cookies) => {
                    cookies.forEach(cookie => {
                        res.cookie(cookie.name, cookie.value, cookie.options);
                    });
                },
            },
        }
    );
}
