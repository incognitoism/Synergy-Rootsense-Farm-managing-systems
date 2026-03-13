import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/support-functions/supabase-server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const clusterId = searchParams.get("id");

        if (!clusterId) {
            return NextResponse.json(
                { error: "Missing cluster id" },
                { status: 400 }
            );
        }

        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("clusters_main_data")
            .select("approval_status, user_id")
            .eq("id", clusterId)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Cluster not found" },
                { status: 404 }
            );
        }

        // security check
        if (data.user_id !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            status: data.approval_status,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
