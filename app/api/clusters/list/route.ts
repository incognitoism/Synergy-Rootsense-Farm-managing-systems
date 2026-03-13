import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { supabaseAdmin } from "@/support-functions/supabase-server";

export async function GET() {
  try {
    // 🔐 Get logged in user from Kinde
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 Fetch clusters linked to this user
    const { data, error } = await supabaseAdmin
      .from("clusters_main_data")
      .select(`
        id,
        farm_name,
        crop_type,
        land_area,
        area_unit,
        approval_status,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clusters: data ?? []
    });

  } catch (err) {
    console.error("Cluster List Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
