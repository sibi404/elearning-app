import { useRef, useState } from "react";

import './navTabs.css';

const NavTabs = ({ tabs, setActiveTab }) => {

    const activeTabRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const styles = {
        width: `${100 / tabs.length}%`
    }

    const handleTabSwitch = (index) => {
        const move = (100 / tabs.length) * index;
        // const move = width * index;
        activeTabRef.current.style.left = move + "%";
        // activeTabRef.current.style.left = `${move}px`;
        // activeTabRef.current.style.width = `${width}px`;
        setActiveIndex(index);
        setActiveTab(index);
    };

    return (
        <div className={`nav-tabs mt-5 py-2 rounded-md text-sm bg-primary-fade flex items-center justify-center relative`}>
            <div
                className="active"
                style={{ width: `calc(${100 / tabs.length}% - 10px)` }}
                ref={activeTabRef}>
            </div>
            {tabs.map((tab, index) => (
                <button
                    className={`nav-tab shrink-0 cursor-pointer z-30 py-2 ${activeIndex === index ? "font-semibold" : "font-normal"}`}
                    style={{ width: `${100 / tabs.length}%` }}
                    key={index} onClick={() => handleTabSwitch(index)}>
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default NavTabs;