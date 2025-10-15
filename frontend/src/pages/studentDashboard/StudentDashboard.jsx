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

import { usePrivateApi } from '../../hooks/usePrivateApi';

const StudentDashboard = () => {

    const [sidePanel, setSidePanel] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [completedCount, setCompletedCount] = useState([]);
    // const userData = JSON.parse(localStorage.getItem("userData"));
    const [userData, setUserData] = useState({});
    const api = usePrivateApi();

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

    const getData = async () => {
        console.log("Requesting enrollment");
        try {
            //for enrollment Details
            const enrollmentResponse = await api.get("enrollment/enrolled-courses/");
            if (enrollmentResponse.status === 200) {
                const { completed_count, enrollments } = enrollmentResponse.data;
                const courses = enrollments.map((enrollment) => ({
                    ...enrollment.course,
                    progress: enrollment.progress,
                    completed: enrollment.completed,
                }));
                setEnrolledCourses(courses);
                setCompletedCount(completed_count);
            }

            //for usersInfo
            const userInfoResponse = await api.get("auth/user-info/");
            const resData = userInfoResponse.data;
            setUserData(
                { ...resData.user, phoneNumber: resData.phone_number, role: resData.role }
            )

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);


    return (
        <div className="flex h-screen xl:bg-primary">
            <SidePanel sidePanel={sidePanel} setSidePanel={setSidePanel} navigation={navigation} quickAccess={quickAccess} dashboardLink="/student" />

            <main className="flex-1 overflow-y-scroll xl:m-2 xl:rounded-2xl  bg-[#F9FAFB]">
                <DashboardHeader setSidePanel={setSidePanel} name={{ firstName: userData.first_name, lastName: userData.last_name }} />
                <Outlet context={{ enrolledCourses, completedCount, userData }} />
            </main>
        </div>
    );
};

export default StudentDashboard;