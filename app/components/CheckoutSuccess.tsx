"use client";

import Link from "next/link";
import useCheckoutSuccess from "../hooks/useCheckoutSuccess";
import { Dispatch, SetStateAction } from "react";
import { IPaymentState } from "../../interfaces/IPaymentState.interface";

interface ICheckoutSuccess {
  paymentState: IPaymentState;
  setPaymentState: Dispatch<SetStateAction<IPaymentState>>;
}

const CheckoutSuccess = ({
  paymentState,
  setPaymentState,
}: ICheckoutSuccess) => {
  const { toggleCartView, toggleCheckoutView } =
    useCheckoutSuccess(setPaymentState);

  const onToggleView = () => {
    toggleCheckoutView(false);
    toggleCartView();
  };

  return (
    <div className="w-full grid place-items-center my-6 text-center">
      <h2 className="text-green-600 text-lg">
        Your payment went through successfully ✔
      </h2>
      <p>Please check your email for the receipt ✉</p>
      <Link
        href="/dashboard"
        className="underline font-bold mt-2"
        onClick={onToggleView}
      >
        Check your order 👉
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
