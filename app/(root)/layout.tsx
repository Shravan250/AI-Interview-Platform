import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <div className="root-layout">
    <nav>
      <Link href="/" className="flex items-center gap-2"> 
        <Image src="/logo.svg" alt="logo" height={32} width={38} />
        <h2 className="text-primary-100">HireIQ</h2>
      </Link>

      {children}
    </nav>
  </div>;
};

export default RootLayout;
