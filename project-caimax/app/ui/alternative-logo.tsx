'use client';
import Image from 'next/image';
import LogoDark from '@/public/logos/Alternative_Logo_White_Green.png';
import LogoLight from '@/public/logos/Alternative_Logo_Black_Green.png';
import Link from 'next/link';
import { useContext } from 'react';
import ThemeContext from '@/context/theme-context';

const AlternativeLogo = ({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Link href="/">
      <Image
        src={theme === 'dark' ? LogoDark : LogoLight}
        width={width}
        height={height}
        className={`${className} mx-3 my-3 select-none px-2 py-2 md:block`}
        alt="CAIMAX AlternativeLogo"
        draggable="false"
        style={{
          userSelect: 'none',
        }}
      />
    </Link>
  );
};

export default AlternativeLogo;
