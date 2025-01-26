


"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";
import MenuPhone from "./Menu";
import CartModal from "./CartModal";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <Image src="/logo.jpeg" alt="ecommm" width={44} height={44} className="rounded-md" />
        </Link>

        {/* RIGHT */}
        <div className="w-full justify-end flex items-end gap-8 md:pl-[3rem]">
          <NavIcons onCartClick={handleCartClick} />
          <MenuPhone />
        </div>
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="logo" width={64} height={24} className="rounded-md" />
            <div className="text-xl tracking-wide"></div>
          </Link>
          <div className="hidden xl:flex gap-6 md:gap-9 md:pl-[3rem]">
            <Link href="/">Homepage</Link>
            <Link href="/deals">Shop</Link>
            <Link href="/deals">Deals</Link>
           
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8 md:pl-[3rem]">
          <SearchBar />
          <div className="flex items-center">
            <NavIcons onCartClick={handleCartClick} />
          </div>
        </div>
      </div>
      {isCartOpen && <CartModal onClose={handleCloseCart} />}
    </div>
  );
};

export default Navbar;





