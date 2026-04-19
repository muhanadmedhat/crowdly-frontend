import UserAvatar from './UserAvatar';

type AuthorRowProps = {
  image?: string;
  name: string;
  date: string;
  daysLeft: number;
};

function AuthorRow({ name, date, daysLeft }: AuthorRowProps) {
  return (
    <div className="flex items-center gap-6 mt-6">
      <div className="flex items-center gap-3">
        <UserAvatar username={name} size="w-10 h-10" />
        <div className="flex flex-col">
          <span className="label-md text-[var(--color-text-secondary)]">Created By</span>
          <span className="font-semibold text-sm text-[var(--color-on-background)]">{name}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="label-md text-[var(--color-text-secondary)]">Ends On</span>
        <span className="font-semibold text-sm text-[var(--color-on-background)]">{date}</span>
      </div>

      <span className="bg-[var(--color-primary)] text-white label-md px-3 py-1 rounded-md ml-auto">
        {daysLeft} Days Left
      </span>
    </div>
  );
}

export default AuthorRow;
