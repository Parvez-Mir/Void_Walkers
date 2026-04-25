import React from 'react';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from './globalghar/BrandLogo';

const SidebarComponent = ({ visible, setVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { navigate('/dashboard'); setVisible(false); } },
    { label: 'Properties', icon: 'pi pi-fw pi-building', command: () => { navigate('/properties'); setVisible(false); } },
    { label: 'Settings', icon: 'pi pi-fw pi-cog', command: () => { navigate('/dashboard'); setVisible(false); } },
    { separator: true },
    { label: 'Help', icon: 'pi pi-fw pi-question', command: () => { navigate('/dashboard'); setVisible(false); } }
  ];

  const SidebarContent = () => (
      <div className="flex flex-col h-full bg-darkBlue shadow-xl">
        <div className="flex items-center justify-center p-4 h-[89px] border-b border-white/10 bg-[#001f4d]">
        <BrandLogo size="sm" />
      </div>
      <div className="flex-1 overflow-y-auto mt-4 px-3 sidebar-menu-wrapper no-scrollbar">
         <Menu 
           model={navigation} 
           className="w-full bg-transparent border-none text-white p-0" 
         />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Static) */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-72 h-full z-20 transition-all duration-300">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <PrimeSidebar 
        visible={visible} 
        onHide={() => setVisible(false)} 
        className="w-72 lg:hidden p-0 bg-darkBlue" 
        showCloseIcon={false}
        pt={{ content: { className: 'p-0 h-full' } }}
      >
        <SidebarContent />
      </PrimeSidebar>
    </>
  );
};

export default SidebarComponent;
