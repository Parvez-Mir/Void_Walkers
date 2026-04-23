import React from 'react';
import { Chart } from 'primereact/chart';
import { ButtonDemo, PopupDemo, DropdownDemo, ToggleDemo } from '../components/Demos';
import { GenericDatatable } from '../components/Datatable';

const Dashboard = () => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Active Users',
        backgroundColor: '#002865', // Using darkBlue
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: 'New Registrations',
        backgroundColor: '#4ea7f1', // Secondary blue from cls-5
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  const lightOptions = {
    plugins: {
      legend: { labels: { color: '#002865', font: { weight: 'bold' } } }
    },
    scales: {
      x: { ticks: { color: '#002865' }, grid: { color: '#ebedef' } },
      y: { ticks: { color: '#002865' }, grid: { color: '#ebedef' } }
    }
  };

  const tableData = [
    { id: 1, name: 'Devam Doshi', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Doe', role: 'Student', status: 'Inactive' },
    { id: 3, name: 'Jane Smith', role: 'Teacher', status: 'Active' },
    { id: 4, name: 'Alice Johnson', role: 'Department-Head', status: 'Active' },
  ];

  const columns = [
    { field: 'name', header: 'User Name' },
    { field: 'role', header: 'Role Assigned' },
    { field: 'status', header: 'Account Status' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-darkBlue sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Template styled with the requested darkBlue theme and configurations.
        </p>
      </div>

      {/* Datatable Section */}
      <div className="mt-8">
         <GenericDatatable data={tableData} columns={columns} title="Registered Users" />
      </div>

      {/* Analytics Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="card p-4 border rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-bold text-darkBlue mb-4">Analytics (Chart.js)</h3>
            <Chart type="bar" data={chartData} options={lightOptions} />
        </div>
        
        {/* Component Showcases */}
        <div className="space-y-6 card p-4 border rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-bold text-darkBlue">UI Combos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buttons</span>
                 <ButtonDemo />
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overlays</span>
                 <PopupDemo />
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inputs</span>
                 <DropdownDemo />
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Toggles</span>
                 <ToggleDemo />
               </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
