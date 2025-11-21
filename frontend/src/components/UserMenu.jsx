import { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { FaOpencart } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import BackDrop from "./BackDrop";
import { logOutUser } from "../store/actions";
import { MdOutlineAdminPanelSettings } from "react-icons/md";


export const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () =>{
    dispatch(logOutUser(navigate));

  }

  const {user} = useSelector((state)=>state.auth);

  const isAdmin = user &&  user?.roles.includes("ROLE_ADMIN");

  const isSeller = user &&  user?.roles.includes("ROLE_SELLER");

  const baseURL = `${import.meta.env.VITE_BACKEND_URL}`
  const image = user?.image
  ? `${baseURL}/images/${user.image}?t=${new Date().getTime()}`
  : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  {console.log("User image:", user?.image)};

  return (
    <div className="relative z-30">
      <div className="sm:border-[1px] sm:border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition  text-slate-700"
        onClick={handleClick}
      >
        <Avatar alt="Menu" src={image}/>
      </div>
      <Menu 
        sx={{width:"400px"}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
            sx:{width:160},
          },
        }}
      >
        <Link to="/profile">
          <MenuItem className="flex gap-2" onClick={handleClose}>
            <BiUser className="text-xl"/>
            <span className="font-bold text-[16px] mt-1">
              {user?.username}
            </span>
          </MenuItem>
        </Link>

        <Link to="/order">
          <MenuItem className="flex gap-2" onClick={handleClose}>
            <FaOpencart className="text-xl"/>
            <span className="font-semibold ">
              Order
            </span>
          </MenuItem>
        </Link>
        {(isAdmin || isSeller) && (
          <Link to={isAdmin ? "/admin" : "/admin/orders"}>
          <MenuItem className="flex gap-2" onClick={handleClose}>
            <MdOutlineAdminPanelSettings className="text-xl"/>
            <span className="font-semibold ">
              {isAdmin ? "Admin Panel" : "Seller Panel" }
            </span>
          </MenuItem>
        </Link>
        )}
        
        
        <MenuItem className="flex gap-2" onClick={logoutHandler}>
          <div className="font-semibold w-full gap-2 flex items-center bg-button-gradient px-4 py-1 text-white rounded-sm">
            <IoExitOutline className="text-xl"/>
              <span className="font-bold text-[16px] mt-1">
                Logout
              </span>
          </div>
        </MenuItem>
       
      </Menu>
      {open && <BackDrop />}
    </div>
  );
}
export default UserMenu;
