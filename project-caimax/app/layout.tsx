import '@/app/ui/global.css';

import { Metadata } from 'next';

import { inter } from '@/app/ui/fonts';
import Particles from '@/app/ui/particles';
import { ThemeProvider } from '@/context/theme-provider';
import Footer from '@/app/ui/footer';
import Header from '@/app/ui/header';

export const metadata: Metadata = {
  title: {
    template: '%s | CAIMAX Dashboard',
    default: 'CAIMAX Dashboard',
  },
  description:
    'Proyecto CAIMAX de la materia Laboratorio de Sistemas Embebidos UNRN',
  metadataBase: new URL('https://unrn.edu.ar/'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <Particles />
        <body
          className={`${inter.className} antialiased dark:bg-stone-950`}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header />
          {children}
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
