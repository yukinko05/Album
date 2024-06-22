import "./globals.css";
import {Providers} from "@/app/providers";

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="ja" className='light'>
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
  );
}