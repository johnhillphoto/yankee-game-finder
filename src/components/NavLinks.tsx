"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="header-nav">
      <Link
        href="/"
        className={`nav-link${pathname === "/" ? " nav-link-active" : ""}`}
      >
        Upcoming Games
      </Link>
      <Link
        href="/completed"
        className={`nav-link${pathname === "/completed" ? " nav-link-active" : ""}`}
      >
        Completed Games
      </Link>
    </nav>
  );
}
