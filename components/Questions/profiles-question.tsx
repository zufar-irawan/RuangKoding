import Image from "next/image";
import Link from "next/link";

type Props = {
  profile: {
    profile_pic?: string | null;
    fullname?: string | null;
    id_dummy?: number | null;
  };
  createdAtLabel: string;
};

export default function UserProfilesQuestion({
  profile,
  createdAtLabel,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 items-center text-sm md:text-base text-muted-foreground">
      <Link href={`/${profile?.fullname?.toLowerCase().replace(" ", "-")}-${profile?.id_dummy}`} className="hover:cursor-pointer group flex gap-2 items-center">
        {profile?.profile_pic ? (
          <Image
            src={profile.profile_pic}
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full h-7 w-7 md:h-8 md:w-8 object-cover shrink-0"
          />
        ) : (
          <p className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground shrink-0">
            {profile?.fullname ? profile.fullname.charAt(0).toUpperCase() : "?"}
          </p>
        )}

        <p className="text-foreground group-hover:text-primary truncate">{profile?.fullname ?? "Pengguna"}</p>
      </Link>




      <div className="w-1 h-1 rounded-full bg-foreground text-foreground shrink-0"></div>

      <p className="text-xs md:text-sm">{createdAtLabel}</p>
    </div>
  );
}
