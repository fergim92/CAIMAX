import AlternativeLogo from './alternative-logo';
import ToggleTheme from './toggle-theme';

const Header = () => {
  return (
    <header className="flex w-full justify-between">
      <AlternativeLogo />
      <ToggleTheme />
    </header>
  );
};

export default Header;
