import "./globals.css";

export const metadata = { title: "ChatDPT" };

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}