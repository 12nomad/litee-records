import { Dispatch, SetStateAction, useEffect } from "react";
import useCartStore from "../../store";
import { IPaymentState } from "../../interfaces/IPaymentState.interface";

const useCheckoutSuccess = (
  setPaymentState: Dispatch<SetStateAction<IPaymentState>>
) => {
  const setPaymentIntentId = useCartStore((s) => s.setPaymentIntentId);
  const clearCart = useCartStore((s) => s.clearCart);
  const toggleCartView = useCartStore((s) => s.toggleCartView);
  const toggleCheckoutView = useCartStore((s) => s.toggleCheckoutView);

  useEffect(() => {
    setPaymentIntentId("");
    clearCart();

    return () => {
      setPaymentState({
        paymentLoading: false,
        paymentSuccess: false,
        paymentError: null,
      });
    };
  }, []);

  return { toggleCartView, toggleCheckoutView };
};

export default useCheckoutSuccess;
