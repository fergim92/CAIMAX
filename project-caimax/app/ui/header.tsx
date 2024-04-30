import AlternativeLogo from './alternative-logo';
import ToggleTheme from './toggle-theme';

const Header = () => {
  return (
    <header className="flex w-full justify-between">
      <AlternativeLogo width={250} height={250} />
      <ToggleTheme />
    </header>
  );
};

export default Header;
