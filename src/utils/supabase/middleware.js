import { createClient } from './server';

export async function updateUser(request) {
    const supabase = createClient(request);
    const token = request.cookies.get('supabase-token');
    
    if (token) {
        console.log('Token gefunden:', token); // Debugging

        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('Error getting user:', error.message);
            return;
        }

        const { user } = data;

        // Token-Aktualisierung
        const { data: newToken, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: token });
        
        if (refreshError) {
            console.error('Fehler beim Aktualisieren des Tokens:', refreshError.message);
            return;
        }

        console.log('Neues Token erhalten:', newToken); // Debugging

        request.cookies.set('supabase-token', newToken.refresh_token);
        return { user, token: newToken.refresh_token };
    } else {
        console.warn('Kein Token gefunden'); // Debugging
    }
}
