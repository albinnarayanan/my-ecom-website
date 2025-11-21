import { FaOpencart } from "react-icons/fa";
import OrderTable from "./OrderTable";
import { useSelector } from "react-redux";
import userOrderFilter from "../../../hooks/userOrderFilter";


const Orders = () => {
    //const adminOrders = [{ "orderId": 6, "email": "user1@example.com", "orderItems": [ { "orderItemId": 4, "product": { "productId": 6, "productName": "Sony WH-1000XM5", "image": "92d7f376-6fa7-4824-b26d-1a0989253085.png", "quantity": 49, "description": "Noise-cancelling wireless headphones with 30-hour battery life", "price": 399, "discount": 15, "specialPrice": 339.15 }, "quantity": 1, "discount": 15, "orderedProductPrice": 339.15 } ], "localDate": "2025-10-21", "payment": { "paymentId": 6, "paymentMethod": "online", "pgPaymentId": "pi_3SKZnF02ii6gzVNK00tCwHq2", "pgStatus": "succeeded", "pgResponseMessage": null, "pgName": "Stripe" }, "totalAmount": 339.15, "orderStatus": "Order Accepted !", "addressId": 4 }, { "orderId": 3, "email": "user1@example.com", "orderItems": [ { "orderItemId": 3, "product": { "productId": 5, "productName": "Ipad Pro", "image": "a5ae568b-a5fd-4972-84f3-5ac9abb064c5.png", "quantity": 19, "description": "High performance Tablet with 4k display and camera", "price": 1100.0, "discount": 29.0, "specialPrice": 781.0 }, "quantity": 1, "discount": 29.0, "orderedProductPrice": 781.0 } ], "localDate": "2025-10-21", "payment": { "paymentId": 3, "paymentMethod": "online", "pgPaymentId": "pi_3SKYkR02ii6gzVNK1mViWeSV", "pgStatus": "succeeded", "pgResponseMessage": null, "pgName": "Stripe" }, "totalAmount": 781.0, "orderStatus": "Order Accepted !", "addressId": 4 }, { "orderId": 7, "email": "user1@example.com", "orderItems": [ { "orderItemId": 5, "product": { "productId": 10, "productName": "Samsung Galaxy S24 Ultra", "image": "ebf687e3-cdaf-4831-aab3-182761453c6c.png", "quantity": 29, "description": "Flagship smartphone with 200MP camera and AMOLED display", "price": 1299.0, "discount": 25.0, "specialPrice": 974.25 }, "quantity": 1, "discount": 25.0, "orderedProductPrice": 974.25 } ], "localDate": "2025-10-22", "payment": { "paymentId": 7, "paymentMethod": "online", "pgPaymentId": "pi_3SKrOU02ii6gzVNK0Rdr96Bs", "pgStatus": "succeeded", "pgResponseMessage": null, "pgName": "Stripe" }, "totalAmount": 974.25, "orderStatus": "Order Accepted !", "addressId": 4 }]
    
    //const pagination = { pageNumber: 0, pageSize: 50, totalElements: 11, totalPages: 1, lastPage: true }
    const { adminOrder, pagination } = useSelector((state)=>state.order);
    
    userOrderFilter();

    const emptyOrder = !adminOrder || adminOrder?.length === 0;
  return (
    <div  className="pb-6 pt-20">
        {emptyOrder ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                <FaOpencart size={50}  className="mb-3"/>
                <h2 className="text-2xl font-semibold">
                    No orders placed yet!
                </h2>
            </div>
        ):(
            <div>
                <OrderTable adminOrder= {adminOrder} pagination={pagination} />
            </div>
        )}
    </div>
  )
}

export default Orders