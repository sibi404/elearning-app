import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";

import { usePrivateApi } from "../../hooks/usePrivateApi";
import { DATE_FORMAT } from '../../config';

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
    const [userData, setUserData] = useState({});
    const [insightData, setInsightData] = useState({});

    const toast = useRef();
    const api = usePrivateApi();

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

    const getData = async () => {
        try {
            //for usersInfo
            const userInfoResponse = await api.get("auth/user-info/");
            const resData = userInfoResponse.data;
            const date = new Date(resData.date_joined);
            setUserData(
                { ...resData.user, phoneNumber: resData.phone_number, role: resData.role, dateJoined: date.toLocaleDateString("en-IN", DATE_FORMAT) }
            )

            //for insight data
            const { data: insightResponseData } = await api.get("course/teacher-insight-data/");
            setInsightData(insightResponseData)

        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="flex h-screen xl:bg-primary">
            <Toast ref={toast} />
            <SidePanel
                sidePanel={sidePanel}
                setSidePanel={setSidePanel}
                navigation={navigation}
                quickAccess={quickAccess}
                dashboardLink="/teacher" />

            <main className="flex-1 overflow-y-scroll xl:m-2 xl:rounded-2xl  bg-[#F9FAFB]">
                <DashboardHeader setSidePanel={setSidePanel} name={{ firstName: userData.first_name || "", lastName: userData.last_name || "" }} />
                <Outlet context={{ userData, insightData }} />
            </main>
            {showAnnouncementModal && (
                <AnnoucementModal onClose={() => setShowAnnouncementModal(false)} toast={toast} />
            )}
        </div>
    );
};

export default TeacherDashboard;