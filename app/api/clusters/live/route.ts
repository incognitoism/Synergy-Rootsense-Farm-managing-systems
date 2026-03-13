import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { supabaseAdmin } from "@/support-functions/supabase-server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const clusterId = searchParams.get("id");

        if (!clusterId) {
            return NextResponse.json(
                { error: "Cluster ID required" },
                { status: 400 }
            );
        }

        // 🔐 Auth
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 🔎 Verify ownership
        const { data: clusterCheck, error: clusterError } =
            await supabaseAdmin
                .from("clusters_main_data")
                .select("id")
                .eq("id", clusterId)
                .eq("user_id", user.id)
                .single();

        if (clusterError || !clusterCheck) {
            return NextResponse.json(
                { error: "Cluster not found or access denied" },
                { status: 403 }
            );
        }

        // 📡 Fetch Live Metrics
        const { data, error } = await supabaseAdmin
            .from("cluster_live_data")
            .select(`
        sector_number,
        node_id,
        soil_moisture,
        soil_temperature,
        soil_ph,
        air_temperature,
        battery_level,
        signal_strength,
        ai_health_score,
        disease_risk_score,
        cluster_status,
        recorded_at
      `)
            .eq("cluster_id", clusterId)
            .order("recorded_at", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data ?? []
        });

    } catch (err) {
        console.error("Live Route Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
