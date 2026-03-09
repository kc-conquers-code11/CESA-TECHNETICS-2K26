import { supabase } from "./supabaseClient";

// Admin Emails List
const ADMIN_EMAILS = ["admin1@strangertech.in", "kc@strangertech.in", "admin@cesa.in"];

// --- LOGIN FUNCTION ---
export const loginApi = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    // Check if user is Admin
    const isAdmin = ADMIN_EMAILS.includes(email);

    return { ...data, isAdmin };
};

// --- SIGNUP FUNCTION ---
export const signupApi = async (formData: any) => {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                last_name: formData.lastName,
            },
        },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    // 2. Create Entry in exam_sessions
    const { error: dbError } = await supabase.from("exam_sessions").insert({
        user_id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        class: formData.class,
        division: formData.division,
        branch: formData.branch,
        status: "active",
        current_round_slug: "rules", // Default start point
    });

    if (dbError) {
        console.error("DB Error:", dbError);
        throw new Error("Database initialization failed.");
    }

    return authData;
};

// --- LOGOUT FUNCTION ---
export const logoutApi = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("cesa-storage");
};
