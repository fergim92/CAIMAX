import NavLinks from '@/app/ui/dashboard/nav-links';
import AlternativeLogo from '../logo/alternative-logo';
import UserInfo from './user-info';
import ToggleTheme from '../toggle-theme';
import SignoutButton from './signout-button';

export default function SideNav() {
  return (
    <div className="sticky top-0 z-50 flex flex-col justify-between bg-lightPaper dark:bg-darkPaper md:h-screen md:min-w-72">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between px-3 pt-3">
          <AlternativeLogo width={160} height={160} />
          <ToggleTheme className="p-2 text-3xl" />
        </div>
        <UserInfo />
      </div>
      <div className="flex w-full items-center justify-around md:hidden">
        <NavLinks />
        <SignoutButton />
      </div>
      <div className="hidden md:flex md:h-full md:flex-col md:justify-between md:py-4">
        <div className="flex flex-col gap-2">
          <NavLinks />
        </div>
        <div className="mt-4 border-t border-default-200 pt-4">
          <SignoutButton />
        </div>
      </div>
    </div>
  );
}
