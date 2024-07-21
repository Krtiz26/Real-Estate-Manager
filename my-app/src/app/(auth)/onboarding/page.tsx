import AccountProfile from "@/app/components/forms/AccountProfiles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = {};
    if (userInfo?.onboarded) redirect("/");

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        image: userInfo?.image || user.imageUrl,
      };

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">   
            <h1 className="head-text text-center">Onboarding</h1>
            <p className="mt-3 text-base-regular text-center text-black">
                Choose your account type to use EZ Reality
            </p>

            <section className="mt-9">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;