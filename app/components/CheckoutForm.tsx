"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import useCartStore from "../../store";
import { IPaymentState } from "../../interfaces/IPaymentState.interface";
import { Button } from "flowbite-react";

interface ICheckoutForm {
  clientSecret: string;
  paymentState: IPaymentState;
  setPaymentState: Dispatch<SetStateAction<IPaymentState>>;
}

const CheckoutForm = ({
  clientSecret,
  paymentState,
  setPaymentState,
}: ICheckoutForm) => {
  const totalPrice = useCartStore((s) => s.totalPrice);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setPaymentState({
      paymentLoading: true,
      paymentError: null,
      paymentSuccess: false,
    });
    stripe
      .confirmPayment({ elements, redirect: "if_required" })
      .then((res) => {
        if (res.error)
          return setPaymentState({
            paymentLoading: false,
            paymentError: res.error,
            paymentSuccess: false,
          });

        return setPaymentState({
          paymentLoading: false,
          paymentError: null,
          paymentSuccess: true,
        });
      })
      .catch((error) => {
        return setPaymentState({
          paymentLoading: false,
          paymentError: error,
          paymentSuccess: false,
        });
      });
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="my-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <h2 className="mt-6 mb-4">
        <span className="font-bold">Total: </span>
        {totalPrice} &euro;
      </h2>
      <Button
        type="submit"
        color="dark"
        disabled={paymentState.paymentLoading || !stripe || !elements}
        className="w-full"
      >
        {paymentState.paymentLoading ? "Processing..." : "Purchase Now 💳"}
      </Button>
      {paymentState.paymentError && (
        <p className="text-red-600">
          <sup>*</sup>
          {paymentState.paymentError.message}
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
