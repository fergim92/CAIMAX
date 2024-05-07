import '@/app/ui/global.css';

import { Metadata } from 'next';

import { inter } from '@/app/ui/fonts';
import Particles from '@/app/ui/particles';
import { ThemeProvider } from '@/context/theme-provider';
import { NextUIProviderContext } from '@/context/nextui-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | CAIMAX Dashboard',
    default: 'CAIMAX Dashboard',
  },
  description:
    'Proyecto CAIMAX de la materia Laboratorio de Sistemas Embebidos UNRN',
  metadataBase: new URL('https://unrn.edu.ar/'),
  openGraph: {
    title: 'CAIMAX Dashboard',
    description:
      'Proyecto CAIMAX de la materia Laboratorio de Sistemas Embebidos UNRN',
    type: 'website',
    locale: 'es_AR',
    url: 'https://caimax.vercel.app',
    images: {
      url: './opengraph-image.png',
      width: 800,
      height: 600,
      alt: 'CAIMAX OpenGraph Image',
    },
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <NextUIProviderContext>
          <body
            className={`${inter.className} antialiased`}
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Particles />
            {children}
          </body>
        </NextUIProviderContext>
      </ThemeProvider>
    </html>
  );
}
