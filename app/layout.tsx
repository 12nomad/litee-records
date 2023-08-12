import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

import Nav from "./components/common/Nav";
import "./globals.css";
import Hydrate from "./components/common/Hydrate";

export const metadata = {
  title: "Litee Records 🎵",
  description:
    "The best place to purchase your albums at the cheapest price...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Hydrate>
          <div className="max-w-screen-xl mx-auto">
            <Nav user={session?.user} />
            <div className="bg-gray-800 w-full h-[1px]"></div>
            <div className="px-4 py-8">{children}</div>
          </div>
        </Hydrate>
      </body>
    </html>
  );
}
