import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

/**
 * A generic, easy-to-use datatable component designed with the 'darkBlue' theme.
 * Wraps PrimeReact logic for simple local usage without heavy server bindings.
 */
export const GenericDatatable = ({ data, columns, title }) => {
    const [globalFilter, setGlobalFilter] = useState('');

    const header = (
        <div className="flex flex-col md:flex-row md:justify-between items-center bg-white p-2 border-b">
            <h2 className="text-xl font-bold text-darkBlue mb-4 md:mb-0">{title}</h2>
            <span className="p-input-icon-left w-full md:w-auto mt-2 md:mt-0">
                <i className="pi pi-search" />
                <InputText 
                    type="search" 
                    placeholder="Global Search..." 
                    value={globalFilter} 
                    onChange={(e) => setGlobalFilter(e.target.value)} 
                    className="w-full md:w-[300px] border-primary p-inputtext-sm"
                />
            </span>
        </div>
    );

    return (
        <div className="card shadow-md border rounded-lg overflow-hidden bg-white">
            <DataTable 
                value={data} 
                paginator 
                rows={10} 
                dataKey="id" 
                emptyMessage="No records found."
                globalFilter={globalFilter} 
                header={header}
                rowHover
                pt={{
                    header: { className: 'bg-white border-0 p-0' },
                    thead: { className: 'bg-gray-50' },
                    headerCell: { className: 'text-darkBlue font-bold py-4 uppercase text-sm' },
                    bodyRow: { className: 'hover:bg-gray-50 transition-colors' },
                }}
            >
                {columns.map((col, i) => (
                    <Column 
                        key={i} 
                        field={col.field} 
                        header={col.header} 
                        sortable 
                        body={col.body}
                        className="py-3 px-4 border-b border-gray-100"
                    />
                ))}
            </DataTable>
        </div>
    );
};
