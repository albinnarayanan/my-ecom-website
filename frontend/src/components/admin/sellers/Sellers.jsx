
import React, { useState } from 'react'
import { IoPersonAddSharp } from "react-icons/io5";
import AddCategoryForm from '../categories/AddCategoryForm';
import Modal from '../../shared/Modal';
import AddSellerForm from './AddSellerForm';
import { useSelector } from 'react-redux';
import Loader from '../../shared/Loader';
import { MdOutlineErrorOutline } from "react-icons/md";
import SellerTable from './SellerTable';
import ErrorPage from '../../shared/ErrorPage';
import useSellerFilter from '../../../hooks/useSellerFilter';

const Sellers = () => {
  const [openSellerModal, setOpenSellerModal] = useState(false);
  const { sellers, pagination } = useSelector((state)=>state.seller);
  const emptySellers = !sellers || sellers.length===0;
  const { isLoading, errorMessage } = useSelector((state)=>state.errors);

  useSellerFilter();
  if(errorMessage){
    return <ErrorPage message={errorMessage} />
  }

  return (
    <div>
      <div className='flex justify-end pt-6 pb-10'> 
        
        <button onClick={()=> setOpenSellerModal(true)} className='bg-custom-blue rounded-md text-white font-semibold py-2 px-4 flex items-center gap-2 shadow-md hover:bg-blue-800 transition-colors hover:text-slate-300 duration-300'>
          <IoPersonAddSharp className='text-xl' />
          Add Seller
        </button>
      </div>
      {!emptySellers && (
        <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
          All sellers
        </h1>
      )}
      {isLoading ? (
        <Loader />
      ):(
        <>
        {emptySellers ? (
          <>
          <div className='flex flex-col justify-center py-10 items-center text-gray-600'> 
            <h2 className='text-2xl font-semibold'>
              <MdOutlineErrorOutline size={20} />
              No Seller Created
            </h2>
          </div>
          
          </>
        ):(
          <SellerTable sellers = {sellers} pagination={pagination} />
        )}
        </>
      )}




      <Modal open={openSellerModal} setOpen={setOpenSellerModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenSellerModal} />
      </Modal>

      
    </div>
  )
}

export default Sellers