'use client';
import Image from 'next/image';
import LogoDark from '@/public/logos/Main_Logo_White_Green.png';
import LogoLight from '@/public/logos/Main_Logo_Black_Green.png';
import Link from 'next/link';
import { useContext } from 'react';
import ThemeContext from '@/context/theme-context';

const MainLogo = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Link href="/">
      <Image
        src={theme === 'dark' ? LogoLight : LogoDark}
        width={350}
        height={350}
        className="select-none md:block"
        alt="CAIMAX MainLogo"
        draggable="false"
        style={{
          userSelect: 'none',
        }}
      />
    </Link>
  );
};

export default MainLogo;
