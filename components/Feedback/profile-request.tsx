import Image from "next/image";
import Link from "next/link";

type ProfileRequestProps = {
  profile: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
    id_dummy: number;
  } | null;
  createdAtLabel: string;
};

export default function ProfileRequest({
  profile,
  createdAtLabel,
}: ProfileRequestProps) {
  if (!profile) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
          U
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">Pengguna</span>
          <span className="text-xs">{createdAtLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/profile/${profile.fullname.replaceAll(" ", "-")}-${profile.id_dummy}`} className="flex group items-center gap-3 text-sm text-muted-foreground">
      {profile?.profile_pic ? (
        <Image
          src={profile.profile_pic}
          alt={profile.fullname}
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
          {profile.fullname.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{profile.fullname}</span>
        {profile.bio && (
          <span className="text-xs line-clamp-1">{profile.bio}</span>
        )}
        <span className="text-xs">{createdAtLabel}</span>
      </div>
    </Link>
  );
}
