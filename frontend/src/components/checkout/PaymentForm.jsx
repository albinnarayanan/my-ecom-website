import { Skeleton } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';


const PaymentForm = ({clientSecret, totalPrice}) => {
    const stripe = useStripe();
    const elements = useElements();
    const[errorMessage, setErrorMessage] = useState("");
    

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!stripe || !elements){
            return;
        }
        //checking form for errors
        const { error: submitError } = await elements.submit();

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams:{
                return_url: `${import.meta.env.VITE_FRONTEND_URL}/order-confirm`,
            },
        });

        if(error){
            setErrorMessage(error.message);
            return false;
        }

    }
    const isLoading = !clientSecret || !stripe || !elements;

    const paymentElementOptions = {
        layout: "tabs",
    }
  return (
    <div>
    <form onSubmit={handleSubmit} className='max-w-lg mx-auto p-4'>
        <h2 className='text-xl font-semibold mb-4'>
            Payment Information
        </h2>
        {isLoading ? (
            <div className="lg:w-[80%] mx-auto py-25 items-center flex flex-col gap-2">
                <Skeleton variant="rectangular" width={350} height={150} />
                <Skeleton variant="rounded" width={350} height={150} />
                <Skeleton variant="rectangular" width={350} height={150} />
            </div> 

        ):(
            <>
                {clientSecret && <PaymentElement options={paymentElementOptions} />}
                {errorMessage && (
                    <div className='text-red-500 mt-2'>{errorMessage}</div>
                )}
                <button className='text-white w-full px-5 py-[10px] bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse' 
                        disabled={!stripe || isLoading}>
                    {!isLoading ? `Pay $${Number(totalPrice).toFixed(2)}`
                              : "Processing"}
                </button>
            </>

        )}

    </form>
    </div>
  )
}

export default PaymentForm