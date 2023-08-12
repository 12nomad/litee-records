"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Navbar, Dropdown, Button } from "flowbite-react";
import { BsDisc, BsBagHeart } from "react-icons/bs";
import { AiFillGoogleCircle } from "react-icons/ai";

import { Lobster } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "../../../store";
import Cart from "../Cart";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
});

interface INavbar extends Partial<Session> {}

const Nav = ({ user }: INavbar) => {
  const toggleCartView = useCartStore((s) => s.toggleCartView);
  const toggleCheckoutView = useCartStore((s) => s.toggleCheckoutView);
  const totalRecords = useCartStore((s) => s.totalRecords);
  const isCartOpen = useCartStore((s) => s.isCartOpen);

  const onToggleView = () => {
    toggleCheckoutView(false);
    toggleCartView();
  };

  return (
    <Navbar fluid={true} rounded={true}>
      <Link href="/">
        <h2 className="flex items-center gap-2 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          <span className={`text-2xl underline ${lobster.className}`}>
            Litee Records
          </span>
          <BsDisc size={25} />
        </h2>
      </Link>

      <div className="flex gap-8 items-center cursor-pointer">
        <div className="relative" onClick={onToggleView}>
          <BsBagHeart size={25} />
          <span className="absolute -top-2 -right-[15px] bg-gray-800 text-white w-5 h-5 rounded-full grid place-items-center text-xs font-bold">
            {totalRecords}
          </span>
        </div>

        {user ? (
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Image
                  src={
                    user?.image ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                  }
                  alt={user?.name || "user profile"}
                  width={35}
                  height={35}
                  className="rounded-full object-contain"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{user?.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user?.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link href="/dashboard">Dashboard</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <Button size="sm" color="dark" onClick={() => signIn()}>
            <AiFillGoogleCircle className="mr-1" />
            <p>Sign in</p>
          </Button>
        )}
      </div>

      {isCartOpen && <Cart onToggleView={onToggleView} />}
    </Navbar>
  );
};

export default Nav;
