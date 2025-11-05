import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidePanel from "../../components/sidePanel/SidePanel";
import DashboardHeader from "../../components/dashboardHeader/DashboardHeader";
import AnnoucementModal from "./dashboard/announcementModal/AnnouncementModal";

import blackOpenBookIcon from '../../assets/icons/open-book-black.png';
import openBookIcon from '../../assets/icons/open_book.png';
import studentIcon from '../../assets/icons/student.png';
import blackStudentIcon from '../../assets/icons/student-black.png';
import videoIcon from '../../assets/icons/video.png';
import paperIcon from '../../assets/icons/paper.png';
import announcementIcon from '../../assets/icons/announcement.png';

const TeacherDashboard = () => {
    const [sidePanel, setSidePanel] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    const navigation = [
        {
            title: "My courses",
            to: "courses",
            activeIcon: blackOpenBookIcon,
            defaultIcon: openBookIcon
        },
        {
            title: "Students",
            to: "students",
            activeIcon: blackStudentIcon,
            defaultIcon: studentIcon
        }
    ];

    const quickAccess = [
        {
            title: "Upload Video",
            icon: videoIcon
        },
        {
            title: "Add material",
            icon: paperIcon
        },
        {
            title: "Send Announcements",
            icon: announcementIcon,
            onClick: () => setShowAnnouncementModal(true)
        }
    ];

    return (
        <div className="flex h-screen xl:bg-primary">
            <SidePanel
                sidePanel={sidePanel}
                setSidePanel={setSidePanel}
                navigation={navigation}
                quickAccess={quickAccess}
                dashboardLink="/teacher" />

            <main className="flex-1 overflow-y-scroll xl:m-2 xl:rounded-2xl  bg-[#F9FAFB]">
                <DashboardHeader setSidePanel={setSidePanel} name={{ firstName: "Sara", lastName: "Johnson" }} />
                <Outlet />
            </main>
            {showAnnouncementModal && (
                <AnnoucementModal onClose={() => setShowAnnouncementModal(false)} />
            )}
        </div>
    );
};

export default TeacherDashboard;