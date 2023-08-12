"use client";

import { PaymentIntent } from "@stripe/stripe-js";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useCartStore from "../../store";

const useCheckout = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<{
    checkoutLoading: boolean;
    checkoutError: string;
  }>({
    checkoutError: "",
    checkoutLoading: true,
  });
  const cartItems = useCartStore((s) => s.cartItems);
  const paymentIntentId = useCartStore((s) => s.paymentIntentId);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const setPaymentIntentId = useCartStore((s) => s.setPaymentIntentId);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    setCheckoutState({ checkoutError: "", checkoutLoading: true });
    axios
      .post<PaymentIntent>(
        "/api/create-payment-intent",
        {
          cartItems,
          paymentIntentId,
          totalPrice: totalPrice * 100,
        },
        { signal: controller.signal }
      )
      .then((res) => {
        if (res.status === 403) return router.push("/api/auth/signin");
        setClientSecret(res.data.client_secret);
        setPaymentIntentId(res.data.id);
        setCheckoutState({ checkoutError: "", checkoutLoading: false });
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 403)
            return router.push("/api/auth/signin");

          setCheckoutState({
            checkoutError: err.message,
            checkoutLoading: false,
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { clientSecret, checkoutState };
};

export default useCheckout;
