import ProfileCard from "./profileCard/ProfileCard";

import sidepanelIcon from '../../assets/icons/show_sidepanel.png';

import { Link } from "react-router-dom";

const DashboardHeader = ({ setSidePanel, name }) => {
    return (
        <header className="w-full p-10 h-[10vh] flex items-center justify-between border-b border-b-border-gray bg-white sticky top-0 z-40">
            <div className="flex items-center">
                <img src={sidepanelIcon} alt="" className="mr-2 cursor-pointer xl:hidden" onClick={() => setSidePanel((prev) => !prev)} />
                <h3 className="hidden xs:block text-sm md:text-base">Welcom back, {name.firstName} 👋</h3>
            </div>
            <Link to="profile">
                <ProfileCard name={name} />
            </Link>

        </header>
    );
};

export default DashboardHeader;