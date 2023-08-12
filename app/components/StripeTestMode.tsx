const StripeTestMode = () => {
  return (
    <div>
      <p className="text-red-600 font-bold mt-4">
        <sup>*</sup>Stripe Payment is on test mode since this is a demo project,
        so please use below credentials to process the payment 👇
      </p>
      <ul>
        <li>
          <span className="font-bold">Card Number:</span> 4242 4242 4242 4242
        </li>
        <li>
          <span className="font-bold">Expiration:</span> 04 / 24
        </li>
        <li>
          <span className="font-bold">CVC:</span> 424
        </li>
      </ul>
    </div>
  );
};

export default StripeTestMode;
