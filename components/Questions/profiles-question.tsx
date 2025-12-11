import Image from "next/image";

type Props = {
  profile: {
    profile_pic?: string | null;
    fullname?: string | null;
  };
  createdAtLabel: string;
};

export default function UserProfilesQuestion({
  profile,
  createdAtLabel,
}: Props) {
  return (
    <div className="flex gap-3 items-center text-md text-muted-foreground">
      {profile?.profile_pic ? (
        <Image
          src={profile.profile_pic}
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full h-8 w-8 object-cover"
        />
      ) : (
        <p className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {profile?.fullname ? profile.fullname.charAt(0).toUpperCase() : "?"}
        </p>
      )}

      <p className="text-foreground">{profile?.fullname}</p>

      <div className="w-1 h-1 rounded-full bg-foreground text-foreground"></div>

      <p>{createdAtLabel}</p>
    </div>
  );
}
