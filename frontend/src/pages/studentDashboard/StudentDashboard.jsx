import DashboardHeader from '../../components/dashboardHeader/DashboardHeader';
import SidePanel from '../../components/sidePanel/SidePanel';

import { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import blackOpenBookIcon from '../../assets/icons/open-book-black.png';
import openBookIcon from '../../assets/icons/open_book.png';
import blackChatIcon from '../../assets/icons/chat-black.png';
import chatIcon from '../../assets/icons/chat.png';
import taskIcon from '../../assets/icons/task.png';
import deadlineIcon from '../../assets/icons/deadline.png';


const StudentDashboard = () => {

    const [sidePanel, setSidePanel] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));

    const navigation = [
        {
            title: "Courses",
            to: "courses",
            activeIcon: blackOpenBookIcon,
            defaultIcon: openBookIcon,
        },
        {
            title: "Messages",
            to: "messages",
            activeIcon: blackChatIcon,
            defaultIcon: chatIcon,
        }
    ];

    const quickAccess = [
        {
            title: "Task",
            icon: taskIcon
        },
        {
            title: "Deadline",
            icon: deadlineIcon
        }
    ]

    return (
        <div className="flex h-screen xl:bg-primary">
            <SidePanel sidePanel={sidePanel} setSidePanel={setSidePanel} navigation={navigation} quickAccess={quickAccess} dashboardLink="/student" />

            <main className="flex-1 overflow-y-scroll xl:m-2 xl:rounded-2xl  bg-[#F9FAFB]">
                <DashboardHeader setSidePanel={setSidePanel} name={{ firstName: userData.firstName, lastName: userData.lastName }} />
                <Outlet />
            </main>
        </div>
    );
};

export default StudentDashboard;