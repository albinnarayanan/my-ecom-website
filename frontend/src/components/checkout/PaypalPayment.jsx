import { Alert, AlertTitle } from "@mui/material"

const PaypalPayment = () => {
  return (
    <div className="flex justify-center items-center h-96">
        <Alert severity="warning" variant="filled" style={{maxWidth: "400px"}} >
            <AlertTitle>
                Paypal is unavailable
            </AlertTitle>
                Paypal payment is unavailable. Please use another payment method. 
        </Alert>
    </div>
  )
}

export default PaypalPayment