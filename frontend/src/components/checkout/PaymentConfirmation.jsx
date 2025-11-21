import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom"
import { stripePaymentConfirmation } from "../../store/actions";
import toast from "react-hot-toast";



const PaymentConfirmation = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const dispatch = useDispatch();
    const [ errorMessage, setErrorMessage ] = useState("");
    const { cart } = useSelector((state) => state.carts);
    const [ loading, setLoading ] = useState(false);
    const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : [];

    const paymentIntent = searchParams.get("payment_intent") ;
    const clientSecret  = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");

    useEffect(() => {
        const sendData = {
            addressId:  selectedUserCheckoutAddress?.addressId,
            pgName: "Stripe",
            pgPaymentId: paymentIntent,
            pgStatus: "succeeded",
            pgResponseMessage: "Payment successful"
        } 
        console.log(selectedUserCheckoutAddress);
        console.log(sendData);
        if(paymentIntent && clientSecret && redirectStatus && cart && cart?.length > 0){
            dispatch(stripePaymentConfirmation(sendData,setErrorMessage,setLoading, toast));
        }

    },[paymentIntent, clientSecret, redirectStatus, cart])
    
  return (
    <div className="min-h-screen flex items-center justify-center">
        {loading ? (
            <div className="lg:w-[80%] mx-auto py-25 items-center flex flex-col gap-2">
                <Skeleton variant="rectangular" width={350} height={150} />
                <Skeleton variant="rounded" width={350} height={150} />
                <Skeleton variant="rectangular" width={350} height={150} />
            </div> 
        ):(
            <div className="p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-gray-200">
                <div className="text-green-500 mb-4 flex justify-center">
                    <FaCheckCircle size={64} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Payment Successful !
                </h2>
                <p>
                    Thankyou for your purchase! Your payment was successful, processing your order.
                </p>

            </div>
        )}
    </div>
  )
}

export default PaymentConfirmation