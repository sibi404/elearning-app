import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import './navTabs.css';

const NavTabs = ({ tabs, setActiveTab, icons, links = null }) => {
    const navigate = useNavigate();

    const activeTabRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const styles = {
        width: `${100 / tabs.length}%`
    }

    const handleTabSwitch = (index) => {
        const move = (100 / tabs.length) * index;
        activeTabRef.current.style.left = move + "%";
        setActiveIndex(index);
        setActiveTab(index);
        if (links) {
            navigate(links[index]);
        }
    };

    return (
        <div className={`nav-tabs mt-5 py-2 rounded-md text-sm bg-primary-fade flex items-center justify-center relative`}>
            <div
                className="active"
                style={{ width: `calc(${100 / tabs.length}% - 10px)` }}
                ref={activeTabRef}>
            </div>
            {tabs.map((tab, index) => {
                const Icon = icons[index];
                return (
                    <button
                        className={`nav-tab shrink-0 cursor-pointer z-30 py-2 flex justify-center ${activeIndex === index ? "font-semibold" : "font-normal"}`}
                        style={{ width: `${100 / tabs.length}%` }}
                        key={index} onClick={() => handleTabSwitch(index)}
                    >
                        <span className="block sm:hidden">
                            <Icon size={18} />
                        </span>

                        <span className="hidden sm:block">
                            {tab}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default NavTabs;