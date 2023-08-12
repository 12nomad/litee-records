import { StripeError } from "@stripe/stripe-js";

export interface IPaymentState {
  paymentLoading: boolean;
  paymentSuccess: boolean;
  paymentError: StripeError | null;
}
