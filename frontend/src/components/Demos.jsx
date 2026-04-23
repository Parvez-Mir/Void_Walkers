import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';

export const ButtonDemo = () => {
    return (
        <div className="card flex flex-wrap justify-center gap-3 p-4 border rounded-md bg-white shadow-sm">
            <Button label="Primary" />
            <Button label="Secondary" severity="secondary" />
            <Button label="Success" severity="success" />
            <Button label="Info" severity="info" />
            <Button label="Warning" severity="warning" />
            <Button label="Help" severity="help" />
            <Button label="Danger" severity="danger" />
        </div>
    );
}

export const PopupDemo = () => {
    const [visible, setVisible] = React.useState(false);
    const toast = useRef(null);

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Action completed', life: 3000});
    }

    return (
        <div className="card flex flex-wrap justify-center gap-3 p-4 border rounded-md bg-white shadow-sm items-center">
            <Toast ref={toast} />
            <Button label="Show Pop-up Dialog" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Button label="Show Toast" icon="pi pi-check" severity="success" onClick={showSuccess} />
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Dialog>
        </div>
    );
}

export const DropdownDemo = () => {
    const [selectedCity, setSelectedCity] = React.useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <div className="card flex justify-center p-4 border rounded-md bg-white shadow-sm items-center">
            <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" 
                placeholder="Select a City" className="w-full md:w-14rem" />
        </div>
    );
}

export const ToggleDemo = () => {
    const [checked, setChecked] = React.useState(false);

    return (
        <div className="card flex justify-center p-4 border rounded-md bg-white shadow-sm items-center gap-3">
             <span className="font-semibold">{checked ? 'ON' : 'OFF'}</span>
            <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
        </div>
    );
}
