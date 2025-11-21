import { Skeleton } from "@mui/material";
import { useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import { useDispatch, useSelector } from "react-redux";
import AddressList from "./AddressList";
import { DeleteModal } from "./DeleteModal";
import toast from "react-hot-toast";
import { deleteUserAddress } from "../../store/actions";

const AddressInfo = ({address}) => {
    const noAddressExist = !address || address.length===0;
    const { isLoading, btnLoader } = useSelector((state)=>state.errors);

    
const dispatch = useDispatch();
const [openAddressModal, setOpenAddressModal] = useState(false);
const [selectedAddress, setSelectedAddress] = useState("");

const addNewAddressHandler = () =>{
    setSelectedAddress("");
    setOpenAddressModal(true);

}
const [openDeleteModal, setOpenDeleteModal] = useState(false);

const deleteAddressHandler = () =>{
    dispatch(deleteUserAddress(toast, selectedAddress?.addressId, setOpenDeleteModal))

}

  return (
    <div className="pt-4">
        {noAddressExist ? (
            <div className="p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center">
                <FaAddressBook  size={50} className="text-gray-500 mb-4 "/>
                <h1 className="text-slate-900 text-center font-semibold text-2xl">
                    No address added yet !
                </h1>
                <p className="mb-6 text-slate-800 text-center">
                   Please add your address to complete purchase.
                </p>
                <button onClick={addNewAddressHandler} className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bgblu700 transition">
                    Add Address
                </button>
            </div> 
        ):(
            <div className="relative p-6 rounded-lg max-w-md mx-auto">
                <h1 className="text-slate-800 text-center font-bold text-2xl">
                    Select Address
                </h1>
                {isLoading ? (
                    <div className="py-4 px-8 items-center">
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }}/>
                        <Skeleton variant="rectangular" width={335} height={60} />
                        <Skeleton variant="rounded" width={335} height={60} />
                         <Skeleton variant="rectangular" width={335} height={60} />
                        <Skeleton variant="rounded" width={335} height={60} />
                    </div>
                ):(
                    <>
                    <div className="space-y-4 pt-6">
                        <AddressList addresses={address} 
                                    setSelectedAddress={setSelectedAddress} 
                                    setOpenAddressModal={setOpenAddressModal}
                                    setOpenDeleteModal = {setOpenDeleteModal}
                                    />
                    </div>
                    {address.length >0 && (
                        <div>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bgblu700 transition" onClick={addNewAddressHandler} >
                                Add More
                            </button>
                        </div>
                    )}
                    </>
                )}
            </div>
        )}
        <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal} >
            <AddAddressForm address ={selectedAddress} setOpenAddressModal = {setOpenAddressModal}/>            
        </AddressInfoModal>

        <DeleteModal open={openDeleteModal} loader={btnLoader} 
            setOpen={setOpenDeleteModal} title="Delete Address" 
            onDeleteHandler={deleteAddressHandler}/>


    </div>
  )
}

export default AddressInfo