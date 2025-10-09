import { NavLink } from "react-router-dom";

const NavLinkItem = ({ to, activeIcon, defaultIcon, text }) => {
    return (
        <NavLink to={to} end>
            {
                ({ isActive }) => (
                    <>
                        <img src={isActive ? activeIcon : defaultIcon} />
                        <span>{text}</span>
                    </>
                )
            }
        </NavLink>
    );
};

export default NavLinkItem;