"use client";

import Image from "next/image";
import { TiDelete } from "react-icons/ti";
import { Button } from "flowbite-react";

import useCartStore from "../../store";
import Checkout from "./Checkout";

interface ICart {
  onToggleView: () => void;
}

const Cart = ({ onToggleView }: ICart) => {
  const cartItems = useCartStore((s) => s.cartItems);
  const removeRecord = useCartStore((s) => s.removeRecord);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const isCheckoutOpen = useCartStore((s) => s.isCheckoutOpen);
  const toggleCheckoutView = useCartStore((s) => s.toggleCheckoutView);

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-black/10"
      onClick={onToggleView}
    >
      <div
        className="absolute top-0 right-0 w-3/4 md:w-1/2 lg:w-1/4 h-screen p-6 z-50 bg-white shadow-md overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {isCheckoutOpen ? (
          <h2
            className="text-lg underline font-bold cursor-pointer"
            onClick={() => toggleCheckoutView(false)}
          >
            Back To Cart 🛒{" "}
          </h2>
        ) : (
          <h2 className="text-lg underline font-bold">
            Your Shopping Cart 🛒{" "}
          </h2>
        )}
        {isCheckoutOpen ? (
          <Checkout />
        ) : (
          <>
            <ul className="flex flex-col gap-4 my-6">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={item.image}
                      alt={item.album}
                      width={315}
                      height={315}
                      className="rounded-md w-16 h-16 object-contain"
                    />
                    <div className="flex flex-col gap-1">
                      <span>{item.artist}</span>
                      <span>{item.album}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span>{item.unit_amount}</span>
                    <TiDelete
                      color="red"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => removeRecord(item.id, item.unit_amount)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mb-4">
              <span className="font-bold">Total: </span>
              {totalPrice} &euro;
            </p>
            <Button
              className="w-full"
              disabled={cartItems.length <= 0}
              onClick={() => toggleCheckoutView(true)}
              color="dark"
            >
              Checkout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
