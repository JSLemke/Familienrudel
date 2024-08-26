// src/utils/handlers.js
export const handleLogin = async ({ email, password, router, setError }) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        alert('Login erfolgreich!');
        router.push('/dashboard');
    } catch (error) {
        setError(error.message);
    }
};
