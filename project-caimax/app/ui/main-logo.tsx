import Image from 'next/image';
import LogoDark from '@/public/logos/Main_Logo_White_Green.png';
import Link from 'next/link';

const MainLogo = () => {
  return (
    <Link href="/">
      <Image
        src={LogoDark}
        width={350}
        height={350}
        className="select-none md:block"
        alt="CAIMAX MainLogo"
        draggable="false"
        style={{
          userSelect: 'none',
          filter: 'drop-shadow(0 5px 5px rgba(255, 255, 255, .1))',
        }}
      />
    </Link>
  );
};

export default MainLogo;
