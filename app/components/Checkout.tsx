"use client";

import { useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Spinner } from "flowbite-react";

import useCheckout from "../hooks/useCheckout";
import CheckoutForm from "./CheckoutForm";
import { IPaymentState } from "../../interfaces/IPaymentState.interface";
import CheckoutSuccess from "./CheckoutSuccess";
import StripeTestMode from "./StripeTestMode";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const [paymentState, setPaymentState] = useState<IPaymentState>({
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: null,
  });
  const { clientSecret, checkoutState } = useCheckout();

  if (checkoutState.checkoutLoading)
    return (
      <div className="w-full grid place-items-center my-6">
        <Spinner aria-label="Hydrating..." />
      </div>
    );

  if (
    (!checkoutState.checkoutLoading && checkoutState.checkoutError) ||
    !clientSecret
  )
    return (
      <p className="text-red-600">
        <sup>*</sup>An error occurred while rendering stripe form, please try
        again later...
      </p>
    );

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "flat" },
  };

  return paymentState.paymentSuccess ? (
    <CheckoutSuccess
      paymentState={paymentState}
      setPaymentState={setPaymentState}
    />
  ) : (
    <>
      <StripeTestMode />
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          clientSecret={clientSecret}
          paymentState={paymentState}
          setPaymentState={setPaymentState}
        />
      </Elements>
    </>
  );
};

export default Checkout;
