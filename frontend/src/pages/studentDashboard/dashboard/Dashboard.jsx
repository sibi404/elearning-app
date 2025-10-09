import openBookIcon from '../../../assets/icons/open_book.png'
import progressIcon from '../../../assets/icons/progress.png';
import trophyIcon from '../../../assets/icons/trophy.png';

import InsightCard from '../../../components/insightCard/InsightCard';
import AnnouncementCard from '../../../components/announcementCard/AnnouncementCard';
import CourseCard from '../../../components/courseCard/CourseCard';
import DeadlineCard from '../../../components/deadlineCard/DeadlineCard';

import { BookOpen, MessageSquare, CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    return (
        <div className='flex flex-col sm:flex-row min-h-[70vh] mt-6 p-2 lg:p-0'>
            <main className='flex-1'>
                <div className='flex items-center justify-between flex-wrap p-3'>
                    <InsightCard title={"Enrolled Courses"} value={6} background={"blue-gradient"} img={openBookIcon} />
                    <InsightCard title={"Overall Progress"} value={"74%"} background={"green-gradient"} img={progressIcon} />
                    <InsightCard title={"Course Completed"} value={2} background={"orange-gradient"} img={trophyIcon} />
                </div>
                <div className='container-border lg:ml-2 p-5 '>
                    <div className='flex items-center justify-start gap-3'>
                        <BookOpen className='text-primary' size={20} />
                        <h2 className='text-md text-text-black '>My Courses</h2>
                    </div>
                    <div className='flex flex-wrap items-center justify-between mt-3 h-[55vh] overflow-y-scroll'>
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                    </div>
                </div>
            </main>
            <aside className='w-full sm:w-[40%] lg:w-[23%]'>
                <div className='container-border p-3 mt-5 md:m-2' >
                    <div className='flex items-center justify-start gap-3 pb-2'>
                        <MessageSquare className='text-primary' size={20} />
                        <h2 className='text-md text-text-black'>Recent Announcements</h2>
                    </div>
                    <div className="flex flex-col mt-1 overflow-y-scroll max-h-[35vh]">
                        <AnnouncementCard />
                        <AnnouncementCard />
                        <AnnouncementCard />
                        <AnnouncementCard />
                        <AnnouncementCard />
                        <AnnouncementCard />
                        <AnnouncementCard />
                    </div>
                </div>

                <div className='container-border  p-3 mt-5 md:mx-2' >
                    <div className='flex items-center justify-start gap-3 pb-2'>
                        <CircleAlert color="#ff7800" className='text-primary' size={20} />
                        <h2 className='text-md text-text-black'>Upcoming Deadlines</h2>
                    </div>
                    <div className="flex flex-col mt-1 overflow-y-scroll max-h-[35vh]">
                        <DeadlineCard />
                        <DeadlineCard />
                        <DeadlineCard />
                    </div>
                </div>
            </aside>
        </div>
    );
};


export default Dashboard;