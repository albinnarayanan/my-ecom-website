import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { adminDashboardProductsAction, fetchProducts } from "../store/actions";

const useDashboardProductFilter = () =>{
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state)=>state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    useEffect(()=>{
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page") 
                        ? Number(searchParams.get("page"))
                        : 1;

        params.set("pageNumber",currentPage - 1);

        const queryString = params.toString();

        dispatch(adminDashboardProductsAction(queryString, isAdmin));

    },[dispatch, searchParams]);
}
export default useDashboardProductFilter;
