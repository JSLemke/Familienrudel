import { createClient } from './server';

export async function updateUser(request) {
    const supabase = createClient(request);
    const token = request.cookies.get('supabase-token');
    
    if (token) {
        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('Error getting user:', error.message);
            return;
        }

        const { user } = data;

        // Refresh the Auth token
        const { data: newToken } = await supabase.auth.refreshSession({ refresh_token: token });
        request.cookies.set('supabase-token', newToken.refresh_token);
        return { user, token: newToken.refresh_token };
    }
}
