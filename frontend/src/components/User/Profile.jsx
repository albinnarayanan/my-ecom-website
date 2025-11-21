import React, { useState } from 'react'
import{ useSelector } from'react-redux';
import { MdEmail } from "react-icons/md";
import { FaArrowRight, FaEdit } from "react-icons/fa";
import {Link} from 'react-router-dom';
import Modal from '../shared/Modal';
import UpdateProfilePhotoForm from './UpdateProfilePhotoForm';
import { Avatar } from '@mui/material';


const Profile = () => {
  const { user } = useSelector((state)=>state.auth);
  const [openImageUploadModal,setOpenImageUploadModal] = useState(false);

  const baseURL = `${import.meta.env.VITE_BACKEND_URL}`
  const image = user?.image
  ? `${baseURL}/images/${user.image}?t=${new Date().getTime()}`
  : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  {console.log("User image:", user?.image)};

  return (
    <div>
    <div className='flex flex-col gap-10 items-center pt-16 min-h-screen bg-gray-100'>
    <div className='flex flex-col items-center w-80 h-70 bg-white max-w-2xl rounded-lg shadow-xl mx-4 sm:mx-auto text-gray-700'>
      <button onClick={()=>setOpenImageUploadModal(true)} className='w-full flex justify-end px-4 pt-6 hover:cursor-pointer'>
        <FaEdit />
      </button>
        <Avatar sx={{ width: 150, height: 150 }} alt="profile-photo" src={image} />
      <div className='flex flex-col items-center justify-center gap-4'> 
        <h1 className='text-2xl font-semibold'>{user.username}</h1>
        <p className='font-medium flex gap-2'><MdEmail size={24} />{user.email}</p>
      </div>
      
    </div>
    <div className=''>
      <Link to="/" className='flex items-center text-blue-700 hover:cursor-pointer gap-2'>
        <FaArrowRight />
        <span>Go Back to shopping</span>
    </Link>
    </div>
      
    </div>
    <Modal open={openImageUploadModal} 
              setOpen={setOpenImageUploadModal } 
              title = {"Add Image"} >
        <UpdateProfilePhotoForm 
          setOpen={setOpenImageUploadModal } 
          user={user} />
    </Modal>
  </div>
  )
}

export default Profile;