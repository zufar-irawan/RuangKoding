import { GetUserProps } from "@/lib/profiles";
import { getUser } from "@/utils/GetUser";
import { redirect } from "next/navigation";
import EditProfileForm from "@/components/EditProfile/EditProfileForm";

export default async function EditProfile() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { userProfile, userSkills, userExperience, userLink } =
    await GetUserProps(user.sub);
  const basicProfile = userProfile.data;
  const skills = userSkills.data;
  const experiences = userExperience.data;
  const links = userLink.data;

  return (
    <div className="flex flex-col mt-16 p-8 items-center w-full">
      <div className="flex flex-col w-full max-w-xl">
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-primary">Edit Profilmu</h1>
          <p className="text-md text-muted-foreground">
            Edit profil kamu agar tampak keren di depan programmer lain!
          </p>
        </div>
      </div>

      <EditProfileForm
        basicProfile={basicProfile}
        initialSkills={skills ?? []}
        initialExperiences={experiences ?? []}
        initialLinks={links ?? []}
        userId={user.sub}
      />
    </div>
  );
}
