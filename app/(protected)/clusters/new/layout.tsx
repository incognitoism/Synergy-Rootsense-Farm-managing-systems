import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/support-functions/getdata";
import DashboardHeader from "@/app/components/LoginHeader"; // <-- Import your header

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
        redirect("/login");
    }

    await syncUser();

    return (
        <div className="layout-wrapper">
            {/* 1. Add the Header here and pass the real user data */}
            <DashboardHeader user={kindeUser} />

            {/* 2. Wrap children to prevent hiding behind the fixed header */}
            <main className="main-content">
                {children}
            </main>

            {/* Note: In Server Components, we use standard style tags without 'jsx' */}
            <style>{`
                .layout-wrapper {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .main-content {
                    flex: 1;
                    /* Push the content down exactly the height of your dash-header */
                    padding-top: 64px; 
                }
            `}</style>
        </div>
    );
}