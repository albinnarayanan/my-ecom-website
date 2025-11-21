import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createStripePaymentSecret } from "../../store/actions";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () => {
    

    const { clientSecret } =useSelector((state)=>state.auth);
    const { totalPrice } = useSelector((state)=>state.carts);
    const { isLoading, errorMessage } = useSelector((state)=>state.errors);
    const { user, selectedUserCheckoutAddress } = useSelector((state)=>state.auth);


    const dispatch = useDispatch();

    useEffect(() => {
      if(!clientSecret){
        const sendData = {
          amount: Number(totalPrice*100),
          currency: "usd",
          email: user.email,
          name: `${user.username}`,
          address: selectedUserCheckoutAddress,
          description: `Order for ${user.email}`,
          metadata: {
            test: "1"
          }
        };
        dispatch(createStripePaymentSecret(sendData));
      }
    },[clientSecret]);

    if(isLoading){
       <div className="lg:w-[80%] mx-auto py-25 items-center flex flex-col gap-2">
          <Skeleton variant="rectangular" width={350} height={150} />
          <Skeleton variant="rounded" width={350} height={150} />
          <Skeleton variant="rectangular" width={350} height={150} /> 
        </div>  
    }

  return (
    <>
        {clientSecret && (
            <Elements stripe={stripePromise} options={{clientSecret}} >
                <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice} />

            </Elements>
        )}
    </>
  )
}

export default StripePayment