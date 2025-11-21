import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getOrdersForDashboard } from "../store/actions";
import { useEffect } from "react";

const userOrderFilter = () => {
const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) =>state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    useEffect(()=>{
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page") 
                        ? Number(searchParams.get("page"))
                        : 1;

        //because pagination starts from 0 for api
        params.set("pageNumber",currentPage - 1);

        const queryString = params.toString();
        console.log("QUERY_STRING",queryString);

        dispatch(getOrdersForDashboard(queryString, isAdmin));

    },[dispatch, searchParams]);
}
export default userOrderFilter;