import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/support-functions/getdata";

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
        <div>
            {children}
        </div>
    );
}
