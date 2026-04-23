import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarLink({ name, iconClass, to, end = true, toggleSidebarClick = () => {} }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={toggleSidebarClick}
            draggable={false}
            className={(props) => {
                return (
                    'flex h-16 w-full cursor-pointer select-none flex-row items-center ps-5 text-xl font-semibold transition-all ' +
                    (props.isActive ? 'bg-white text-darkBlue' : 'text-white hover:bg-white hover:text-darkBlue')
                );
            }}
        >
            <div className="me-2"><i className={iconClass}></i></div>
            <div>{name}</div>
        </NavLink>
    );
}

export default SidebarLink;
