import React, { useState } from 'react';
import SidebarComponent from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarComponent visible={sidebarVisible} setVisible={setSidebarVisible} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header toggleSidebar={() => setSidebarVisible(true)} />
        
        <main className="w-full grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
