import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Menu } from 'primereact/menu';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { logout } from '../store/authSlice';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCaretDown } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BrandLogo } from './propintel/BrandLogo';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuLeft = useRef(null);

  const username = localStorage.getItem('username') || "User";

  const logoutConfirmation = () => {
    confirmDialog({
      message: 'Are you sure you want to logout?',
      header: 'Logout ?',
      icon: 'pi pi-power-off',
      defaultFocus: 'accept',
      accept: async () => {
         try {
            await api.post('/auth/logout');
         } catch(e) { } finally {
            dispatch(logout()); // cleans localStorage in slice
            navigate('/login');
         }
      },
      reject: () => {},
    });
  };

  const items = [
    {
      label: localStorage.getItem('role') || 'STUDENT',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            // Optional: navigate to profile
          },
        },
        {
          label: 'Logout',
          icon: 'pi pi-power-off',
          command: logoutConfirmation,
        },
      ]
    }
  ];

  return (
    <div className="relative flex w-full flex-row items-center justify-center border-b py-4 shadow-sm bg-white">
      <ConfirmDialog
        draggable={false}
        className="m-5 w-full md:w-2/3 lg:w-1/3"
        pt={{ message: { className: 'w-full m-0' }, icon: { className: 'me-3' } }}
        acceptClassName="bg-darkBlue text-white border-0 rounded-md py-2 px-4 shadow-sm font-semibold"
        rejectClassName="p-button-danger rounded-md"
      />
      
      <div className="mx-5 cursor-pointer md:hidden text-darkBlue" onClick={toggleSidebar}>
        <GiHamburgerMenu size={25} />
      </div>
      
      <div className="flex w-full justify-center md:mx-5 md:justify-start">
        <BrandLogo size="sm" tone="dark" />
      </div>
      
      <div className="mx-5">
        <a className="flex cursor-pointer flex-row items-center text-gray-700 hover:text-darkBlue transition-colors" onClick={(e) => menuLeft.current.toggle(e)}>
          <div className="mx-2 flex items-center font-semibold md:text-xl">
            <FaUser className="my-1 me-2 md:text-xl" />
            <span className="hidden md:block whitespace-nowrap">{username}</span>
            <FaCaretDown className="my-1 md:ms-2" />
          </div>
        </a>
        <Menu model={items} popup ref={menuLeft} popupAlignment="right" />
      </div>
    </div>
  );
};

export default Header;
