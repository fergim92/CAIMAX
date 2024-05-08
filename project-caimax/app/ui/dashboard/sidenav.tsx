import NavLinks from '@/app/ui/dashboard/nav-links';
import AlternativeLogo from '../alternative-logo';
import UserInfo from './user-info';
import ToggleTheme from '../toggle-theme';
import SignoutButton from './signout-button';

export default function SideNav() {
  return (
    <div className="flex flex-col justify-between bg-paper">
      <div>
        <div className="flex flex-row items-center justify-between ">
          <AlternativeLogo width={160} height={160} />
          <ToggleTheme className="m-3 p-2 text-3xl" />
        </div>
        <UserInfo />
      </div>
      <div className="flex w-full items-center justify-around md:hidden ">
        <NavLinks />
        <SignoutButton />
      </div>
      <div className="hidden md:flex md:h-full md:flex-col md:justify-between">
        <div>
          <NavLinks />
        </div>
        <SignoutButton />
      </div>
    </div>
  );
}
