import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/support-functions/supabase-server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ClusterRouter({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: clusterId } = await params; // ✅ unwrap params

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
        redirect("/");
    }

    const { data: cluster, error } = await supabaseAdmin
        .from("clusters_main_data")
        .select("id, approval_status, user_id")
        .eq("id", clusterId)
        .single();

    if (error || !cluster) {
        redirect("/landing_page");
    }

    // Prevent access to others' clusters
    if (cluster.user_id !== user.id) {
        redirect("/landing_page");
    }

    if (cluster.approval_status === "pending") {
        redirect(`/clusters/${clusterId}/approval`);
    }

    if (cluster.approval_status === "rejected") {
        redirect(`/clusters/${clusterId}/rejected`);
    }

    if (cluster.approval_status === "approved") {
        redirect(`/clusters/${clusterId}/dashboard`);
    }

    redirect("/landing_page");
}

