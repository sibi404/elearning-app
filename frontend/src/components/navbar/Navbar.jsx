import { Link } from "react-router-dom";

import './navbar.css'

import profile from '../../assets/icons/profile-icon.png';

const Navbar = () => {
    return (
        <header className="w-full py-7 px-10 border-b-2 mb-2 border-b-gray-200 bg-white sticky top-0 z-50">
            <nav className="max-w-[1400px] mx-auto flex items-center justify-between">
                <div>
                    <a href="/">
                        <h1 className="text-2xl text-primary font-bold">Logo</h1>
                    </a>
                </div>
                <div className="flex">
                    <ul className="flex items-center mr-5">
                        <li className="nav-item">Home</li>
                        <li className="nav-item ml-3">Courses</li>
                    </ul>
                    <div className="profile bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
                        <img src={profile} alt="" className="w-5" />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;