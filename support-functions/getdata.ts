import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { supabaseAdmin } from "./supabase-server";

export async function syncUser() {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) return null;

    const { data: existingUser, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("auth_provider_id", kindeUser.id)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error);
        return null;
    }

    if (!existingUser) {
        const { data: newUser, error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
                auth_provider: "kinde",
                auth_provider_id: kindeUser.id,
                email: kindeUser.email,
                first_name: kindeUser.given_name,
                last_name: kindeUser.family_name,
                avatar_url: kindeUser.picture,
                last_login: new Date(),
            })
            .select()
            .single();

        if (insertError) {
            console.error("Insert error:", insertError);
            return null;
        }

        return newUser;
    }

    await supabaseAdmin
        .from("users")
        .update({ last_login: new Date() })
        .eq("auth_provider_id", kindeUser.id);

    return existingUser;
}
