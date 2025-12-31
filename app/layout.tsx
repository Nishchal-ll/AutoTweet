
// import "./globals.css";
// import Providers from "./providers/SessionProviderClient";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//      <html>
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }
'use client';
import "./globals.css";
import Providers from "./providers/SessionProviderClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

