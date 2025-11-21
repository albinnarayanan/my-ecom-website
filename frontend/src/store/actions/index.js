
import api from "../../api/api";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const {data} = await api.get(`/public/products?${queryString}`);
        dispatch({ 
            type: 'FETCH_PRODUCTS', 
            payload: data.content ,
            pageNumber : data.pageNumber,
            pageSize : data.pageSize,
            totalPages : data.totalPages,
            totalElements : data.totalElements,
            lastPage : data.lastPage
        });
        localStorage.setItem("products",JSON.stringify(data.content));
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch"}); //optional chaining
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: 'CATEGORY_LOADER' });
        const {data} = await api.get(`/public/categories`);
        dispatch({ 
            type: 'FETCH_CATEGORIES', 
            payload: data.content ,
            pageNumber : data.pageNumber,
            pageSize : data.pageSize,
            totalPages : data.totalPages,
            totalElements : data.totalElements,
            lastPage : data.lastPage
        });
        dispatch({ type: 'IS_ERROR' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch categories"}); //optional chaining
    }
};

export const addToCart = (data, qty = 1, toast) => 
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        // Check for stocks
        const isQuantityExist = getProduct.quantity >= qty;

        // If in stock -> add
        if (isQuantityExist) {
            dispatch({ type: "ADD_CART", payload: {...data, quantity: qty}});
            toast.success(`${data?.productName} added to the cart`);
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            // error
            toast.error("Out of stock");
        }
};


export const increaseCartQuantity = 
    (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

        if (isQuantityExist) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);

            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity },
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            toast.error("Quantity Reached to Limit");
        }

    };



export const decreaseCartQuantity = 
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantity},
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }

export const removeFromCart =  (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_CART", payload: data });
    toast.success(`${data.productName} removed from cart`);
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signin",sendData);
        dispatch({
            type:"LOGIN_USER",
            payload: data,
        });
        localStorage.setItem("auth", JSON.stringify(data));
        reset();
        toast.success("Login Success");
        navigate("/")
        
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ||"Internal Server Error");
        
    }
    finally{
        setLoader(false);
    }
}

export const registerNewUser = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signup",sendData);
        reset();
        toast.success(data?.message || "User Registered Successfully");
        navigate("/login")
        
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.response?.data?.password ||"Internal Server Error");
        
    }
    finally{
        setLoader(false);
    }
}
export const logOutUser = (navigate) => (dispatch) =>{
    dispatch({
        type:"LOG_OUT",
    });
    localStorage.removeItem("auth");
    localStorage.removeItem("cartItems");
    navigate("/login");
}

export const addUpdateUserAddress = 
        (sendData,toast, addressId, setOpenAddressModal) => async (dispatch, getState) =>{

        //if tokenbased auth is required
        // const { user } = getState().auth;
        // await api.posy(`/address`,sendData,{
        //     headers:{Authorization:"Bearer"+user.jwtToken}, 
        // })
        
    dispatch({
        type:"BUTTON_LOADER",
    });
    try {
        if(!addressId){
            const { data } = await api.post("/addresses",sendData);

        }else{
           await api.put(`/addresses/${addressId}`,sendData);
        }
        dispatch(getUserAddresses());
        toast.success("Address saved successfully");
        dispatch({
            type:"IS_SUCCESS",
        })
        
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ||"Internal Server Error");
        dispatch({
            type:"IS_ERROR",
            payload: null,
        })
    }
    finally{
        setOpenAddressModal(false);
    }

}

export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const {data} = await api.get(`/addresses`);
        dispatch({ 
            type: 'USER_ADDRESS',
            payload: data, 
           
        });
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch user's addresses"}); //optional chaining
    }
};

export const selectUserCheckoutAddress = (address) =>{
    localStorage.setItem("CHECKOUT_ADDRESS",JSON.stringify(address));
    return(
        {
            type:"SELECT_CHECKOUT_ADDRESS",
            payload: address,
        }
    );
}

export const deleteUserAddress = (toast, addressId, setOpenDeleteModal ) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'BUTTON_LOADER' });
        await api.delete(`/addresses/${addressId}`);
        dispatch({
            type:"IS_SUCCESS",
        })
        dispatch(getUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Some error occured"}); //optional chaining
    }
    finally{
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () =>{
    return{
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
}

export const addPaymentMethod = (method) =>{
    return(
        {
            type:"ADD_PAYMENT_METHOD",
            payload: method,
        }
    );
}

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};


export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');
        
        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
};

export const createStripePaymentSecret = (sendData) => async(dispatch, getState) => {
    try {
        dispatch({
            type: "IS_FETCHING",
        });
        const { data } = await api.post("/order/stripe-client-secret",sendData)
        dispatch({
            type:"CLIENT_SECRET",
            payload: data,
        });
        localStorage.setItem("client-secret",JSON.stringify(data));
        dispatch({
            type:"IS_SUCCESS",
        })
        
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ||"Failed to create client secret");
        
    }
}

export const stripePaymentConfirmation = (sendData, setErrorMessage, setLoading, toast) => async(dispatch, getState) => {
    try {
        const response  = await api.post("/order/users/payments/online", sendData);
            console.log(response)
            if (response.data){
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("client-secret");
                dispatch({
                    type: "REMOVE_CLIENT_SECRET_ADDRESS"
                });
                dispatch({
                    type: "CLEAR_CART"
                });
                toast.success("Order accepted");
        }
        else{
            setErrorMessage("Payment Failed. Please try again.")
        }
       
        
    } catch (error) {
        console.log(error);
        setErrorMessage("Payment Failed. Please try again.")
        
    }
};

export const analyticsAction = () => async(dispatch, getState) => {
    try {
       dispatch({
        type: "IS_FETCHING"
       });
       const { data } = await api.get('/admin/app/analytics');
       dispatch({
        type: "FETCH_ANALYTICS",
        payload: data,
       });
       dispatch({
        type: "IS_SUCCESS"
       });
        
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch analytics data",
        });
        
        
    }
};
export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const endPoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const {data} = await api.get(`${endPoint}?${queryString}`);
        dispatch({ 
            type: 'GET_ADMIN_ORDERS', 
            payload: data.content ,
            pageNumber : data.pageNumber,
            pageSize : data.pageSize,
            totalPages : data.totalPages,
            totalElements : data.totalElements,
            lastPage : data.lastPage
        });
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch order data"}); //optional chaining
    }
};

export const updateOrderStatusFromDashboard = 
        (orderId, orderStatus,toast, setLoader, isAdmin)  => async (dispatch, getState) =>{

    try {
        setLoader(true);
        const endPoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const { data } = await api.put(`${endPoint}/${orderId}/status`,{status: orderStatus}); 
        
        toast.success(data.message || "Order Update Successful");
        await dispatch(getOrdersForDashboard());
        
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ||"Internal Server Error");
        dispatch({
            type:"IS_ERROR",
            payload: null,
        })
    }
    finally{
        setLoader(false);
    }

}

export const adminDashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const endPoint = isAdmin ? "/admin/products" : "/seller/products"
        const {data} = await api.get(`${endPoint}?${queryString}`);
        dispatch({ 
            type: 'FETCH_PRODUCTS', 
            payload: data.content ,
            pageNumber : data.pageNumber,
            pageSize : data.pageSize,
            totalPages : data.totalPages,
            totalElements : data.totalElements,
            lastPage : data.lastPage
        });
        localStorage.setItem("products",JSON.stringify(data.content));
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch"}); //optional chaining
    }
};

export const updateProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
        try {
            setLoader(true);
            const endPoint = isAdmin ? "/admin/products" : "/seller/products"
            await api.put(`${endPoint}/${sendData.id}`,sendData);
            toast.success("Product updated successfully");
            reset();
            setLoader(false);
            setOpen(false);
            await dispatch(adminDashboardProductsAction());
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error?.response?.data?.description ||"Failed to update product");
            
        }
        
}

export const addNewProductFromDashboard = (sendData, toast, reset, setLoader, setOpen,isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endPoint = isAdmin ? "/admin": "/seller"
        await api.post(`${endPoint}/categories/${sendData.categoryId}/product`,sendData);
        toast.success("Product added successfully");
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(adminDashboardProductsAction());
        
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.description || "Failed to add product");
    }

}

export const deleteProductFromAdminDashboard = (setLoader, id, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endPoint = isAdmin ? "/admin/products" : "/seller/products";
        await api.delete(`${endPoint}/${id}`);
        dispatch({
            type:"IS_SUCCESS",
        })
        toast.success("Product deleted successfully");
        await dispatch(adminDashboardProductsAction());
        setLoader(false);
        setOpenDeleteModal(false);

        
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some error occured"
        ) ;
    }
   
    
};

export const updateProductImageFromDashboard = 
    (formData,productId, toast, setLoader, setOpen,isAdmin) => async (dispatch) => {
        try {
            setLoader(true);
            const endPoint = isAdmin ? "/admin/products": "/seller/products"
            await api.put(`${endPoint}/${productId}/image`,formData);
            toast.success("Image upload successful");
            setLoader(false);
            setOpen(false);
            await dispatch(adminDashboardProductsAction());
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error?.response?.data?.description ||"Product image upload failed");
            
        }
        
}
export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };


export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const getAllSellersDashboard = (queryString) => async (dispatch, getState) =>{
    try {
        dispatch({
            type:"IS_FETCHING",

        })
        const { data } = await api.get(`/auth/sellers?${queryString}`);
        dispatch({
            type: "GET_SELLERS",
            payload: data["content"],
            pageNumber: data["pageNumber"],
            pageSize: data["pageSize"],
            totalElements: data["totalElements"],
            totalPages: data["totalPages"],
            lastPage: data["lastPage"],
      });

        dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };
  export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };

  export const getUserDetails = () => async (dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        
        const {data} = await api.get('/auth/user');
        console.log("Fetched user data:", data);
        if (data) {
            localStorage.setItem("auth", JSON.stringify(data));
            dispatch({ type: 'FETCH_USER_DETAILS', payload: data });
            dispatch({ type: 'IS_SUCCESS' });
        } else {
            throw new Error("User data is missing from response");
        }   

    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR', 
            payload: error?.response?.data?.message || "Failed to fetch user details"}); //optional chaining
    }
};
 
  export const updateUserImage = 
    (formData,userId, toast, setLoader, setOpen) => async (dispatch) => {
        try {
            setLoader(true);
            
            const { data } = await api.put(`/public/user/${userId}/image`,formData);
            toast.success("Image upload successful");
            await dispatch(getUserDetails());
            setLoader(false);
            setOpen(false);

        } catch (error) {
            console.error("Update error:", error);
            toast.error(error?.response?.data?.description ||"Product image upload failed");
            
        }
        
}