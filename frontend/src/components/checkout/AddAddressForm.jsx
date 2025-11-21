import InputField from "../shared/InputField";
import Spinners from "../shared/SPinners";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaAddressCard } from "react-icons/fa";
import { addUpdateUserAddress } from "../../store/actions";
import { useEffect } from "react";

const AddAddressForm = ({address, setOpenAddressModal }) => {
    const { btnLoader } = useSelector((state) =>state.errors);
   
  
      const {
          register,
          handleSubmit,
          reset,
          setValue,
          formState: {errors},
      } = useForm({
          mode: "onTouched",
      });
  
      const dispatch = useDispatch();
      const onSaveAddressHandler = async(data)=>{
         dispatch(addUpdateUserAddress(
          data,
          toast, 
          address?.addressId,
          setOpenAddressModal
          
         ))
      };
      useEffect(()=>{
        if(address?.addressId){
            setValue("buildingName",address?.buildingName);
            setValue("city",address?.city);
            setValue("state",address?.state);
            setValue("pincode",address?.pincode);
            setValue("country",address?.country);
            setValue("street",address?.street);
        }
      },[address])
  return (
    <div className="">
            <form onSubmit={handleSubmit(onSaveAddressHandler)} 
              className="" >
                <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
                    <FaAddressCard className="mr-2 text-2xl"/>
                      {!address?.addressId ? "Add Address" : "Update Address" }
                </div>
                <div className="flex flex-col gap-4">
                    <InputField 
                        label="Building Name" required id="buildingName" type="text"
                        register={register} errors={errors} message="Building Name is required"
                        placeholder="Enter Building Name"
                    />
                    <InputField 
                        label="City" required id="city" type="text"
                        register={register} errors={errors} message="City is required"
                        placeholder="Enter City"
                    />
                    <InputField 
                        label="State" required id="state" type="text"
                        register={register} errors={errors} message="State is required"
                        placeholder="Enter State"
                    />
                    <InputField 
                        label="Pincode" required id="pincode" type="text"
                        register={register} errors={errors} message="Pincode is required"
                        placeholder="Enter Pincode"
                    />
                    <InputField 
                        label="Street" required id="street" type="text"
                        register={register} errors={errors} message="Street is required"
                        placeholder="Enter Street"
                    />
                    <InputField 
                        label="Country" required id="country" type="text"
                        register={register} errors={errors} message="Country is required"
                        placeholder="Enter Country"
                    />
                    
                </div>
                <button disabled={btnLoader} className="text-white bg-custom-blue px-4 py-2 rounded-md mt-4" 
                    type="submit" >
                     {btnLoader ? (<><Spinners /> Loading...</>) : (<>Save</>) }   
                </button>
                
                
            </form>
        </div>
        
  )
}

export default AddAddressForm;