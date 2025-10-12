import taskIcon from '../../assets/icons/task.png';
import deadlineIcon from '../../assets/icons/deadline.png';
import logoutIcon from '../../assets/icons/logout.png';
import closeIcon from '../../assets/icons/close.png';
import homeIcon from '../../assets/icons/home.png';
import blackDashboardIcon from '../../assets/icons/dashboard-black.png';
import whiteDashboardIcon from '../../assets/icons/dashboard-white.png';

import './sidePanel.css';

import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import NavLinkItem from './NavLinkItem';

import { AuthContext } from '../../context/AuthContext';

const SidePanel = ({ sidePanel, setSidePanel, navigation, quickAccess, dashboardLink }) => {
    const navigate = useNavigate();
    const { setToken, setRole } = useContext(AuthContext);

    const handleLogout = () => {
        setToken(null);
        setRole(null);
        console.log("Logged out");
        navigate("/");
    };
    return (
        <aside className={`sidepanel fixed xl:static ${sidePanel ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 text-white min-h-screen xl:w-[18%] bg-primary p-8 flex flex-col z-20`}>
            <div className='xl:hidden absolute top-5 right-5 cursor-pointer' onClick={() => setSidePanel((prev) => !prev)}>
                <img src={closeIcon} alt="" className='w-5' />
            </div>
            <div className="logo font-bold text-3xl pt-5">
                LOGO
            </div>
            <div className="mt-10 navigation">
                <h3 className="text-sm uppercase">Navigation</h3>
                <ul className="pl-5 mt-3">
                    <li className="">
                        <NavLink to="/"><img src={homeIcon} alt="" /><span>Home</span></NavLink>
                    </li>
                    <li className=''>
                        <NavLinkItem to={dashboardLink} activeIcon={blackDashboardIcon} defaultIcon={whiteDashboardIcon} text="Dashboard" />
                    </li>
                    {
                        navigation.map((item) => (
                            <li key={item.title}>
                                <NavLinkItem to={item.to} activeIcon={item.activeIcon} defaultIcon={item.defaultIcon} text={item.title} />
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="mt-10 quick-access">
                <h3 className="text-sm uppercase">Quick Access</h3>
                <ul className="pl-5 mt-3">
                    {
                        quickAccess.map((item) => (
                            <li className='py-3 px-4 cursor-pointer flex items-center' key={item.title}>
                                <img src={item.icon} alt="" />
                                <span>{item.title}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className='border-t border-t-gray-500 mt-auto'>
                <ul>
                    <li className='non-link' onClick={handleLogout}><img src={logoutIcon} alt="" /><span>Log Out</span></li>
                </ul>
            </div>
        </aside>
    )
};

export default SidePanel;