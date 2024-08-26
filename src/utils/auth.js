import createClientInstance from 'src/utils/supabase/client.js';

export const signUp = async (email, password, familyName) => {
    const supabase = createClientInstance();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(error.message);

    const user = data.user;
    if (!user) throw new Error('User sign-up failed');

    const familyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { error: userError } = await supabase.from('users').insert([
        {
            id: user.id,
            email: user.email,
            familycode: familyCode,
            createdAt: new Date().toISOString(),
            is_admin: true,
        },
    ]);
    if (userError) throw userError;

    const { error: familyError } = await supabase.from('families').insert([
        {
            familycode: familyCode,
            createdby: user.id,
            members: JSON.stringify({ [user.id]: true }),
            createdat: new Date().toISOString(),
        },
    ]);

    if (familyError) throw familyError;

    return { user, familyCode };
};

export const signIn = async (email, password) => {
    const supabase = createClientInstance();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);
    return data;
};
