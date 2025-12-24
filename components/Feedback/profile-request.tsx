type ProfileRequestProps = {
  profile: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
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
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
        {profile.fullname.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{profile.fullname}</span>
        {profile.bio && (
          <span className="text-xs line-clamp-1">{profile.bio}</span>
        )}
        <span className="text-xs">{createdAtLabel}</span>
      </div>
    </div>
  );
}
