import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/support-functions/supabase-server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
    try {
        // 🔐 Get logged-in user from Kinde
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate required fields
        const requiredFields: Record<string, string> = {
            fullName: "Full Name",
            farmName: "Farm Name",
            landArea: "Land Area",
            selected_plan: "Billing Plan",
            billing_frequency: "Billing Frequency",
            payment_method: "Payment Method",
        };
        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !body[key])
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // 🧠 Insert into database
        const { data, error } = await supabaseAdmin
            .from("clusters_main_data")
            .insert({
                // 🔗 USER
                user_id: user.id,

                // ======================
                // STEP 1
                // ======================
                full_name: body.fullName || null,
                date_of_birth: body.dob || null,
                address: body.address || null,
                govt_id_type: body.govtIdType || null,
                govt_id_number: body.govtIdNumber || null,
                monthly_revenue_range: body.revenue || null,

                // ======================
                // STEP 2
                // ======================
                provisioning_mode: body.mode || "auto",
                farm_name: body.farmName || null,
                land_area: body.landArea ? Number(body.landArea) : null,
                area_unit: body.areaUnit || null,
                crop_type: body.cropType || null,
                farm_type: body.farmType || null,
                soil_type: body.soilType || null,
                irrigation_type: body.irrigationType || null,
                climate_category: body.climateCategory || null,
                connectivity_type: body.connectivityType || null,
                power_availability: body.powerAvailability || null,
                data_modules: body.dataModules || [],
                reporting_interval: body.reportingInterval || null,
                sensor_nodes: body.sensorNodes ? Number(body.sensorNodes) : null,
                mesh_density: body.meshDensity || null,
                processing_type: body.processingType || null,
                redundancy_level: body.redundancyLevel || null,
                compute_tier: body.computeTier || null,
                api_access: body.apiAccess || false,
                historical_data: body.historicalData || false,
                third_party_integrations: body.thirdPartyIntegrations || null,

                // ======================
                // STEP 3
                // ======================
                plan_id: body.selected_plan,
                billing_frequency: body.billing_frequency,
                payment_method: body.payment_method,

                card_last4: body.card_last4 || null,
                upi_id: body.upi_id || null,

                // ======================
                // SYSTEM
                // ======================
                approval_status: "pending",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select("id")
            .single();

        if (error) {
            console.error("Supabase Insert Error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            clusterId: data.id,
        });

    } catch (err) {
        console.error("API Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
