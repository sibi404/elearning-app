import openBookIcon from '../../../assets/icons/open_book.png'
import progressIcon from '../../../assets/icons/progress.png';
import trophyIcon from '../../../assets/icons/trophy.png';

import InsightCard from '../../../components/insightCard/InsightCard';
import AnnouncementCard from '../../../components/announcementCard/AnnouncementCard';
import CourseCard from '../../../components/courseCard/CourseCard';
import DeadlineCard from '../../../components/deadlineCard/DeadlineCard';
import EmptyMessage from '../emptyMessage/EmptyMessage';

import { usePrivateApi } from '../../../hooks/usePrivateApi';

import { BookOpen, MessageSquare, CircleAlert } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';



const Dashboard = () => {
    const api = usePrivateApi();
    const { enrolledCourses, completedCount } = useOutletContext();
    const overallProgress = enrolledCourses.length > 0
        ? (enrolledCourses.reduce((acc, course) => acc + parseFloat(course.progress), 0) / enrolledCourses.length)
        : 0;


    return (
        <div className='flex flex-col sm:flex-row min-h-[70vh] mt-6 p-2 lg:p-0'>
            <main className='flex-1'>
                <div className='flex items-center justify-between flex-wrap p-3'>
                    <InsightCard title={"Enrolled Courses"} value={enrolledCourses.length} background={"blue-gradient"} img={openBookIcon} />
                    <InsightCard
                        title={"Overall Progress"}
                        value={`${overallProgress % 1 === 0 ? overallProgress : overallProgress.toFixed(1)}%`}
                        background={"green-gradient"}
                        img={progressIcon}
                    />
                    <InsightCard title={"Course Completed"} value={completedCount} background={"orange-gradient"} img={trophyIcon} />
                </div>
                <div className='container-border lg:ml-2 p-5 '>
                    <div className='flex items-center justify-start gap-3'>
                        <BookOpen className='text-primary' size={20} />
                        <h2 className='text-md text-text-black '>My Courses</h2>
                    </div>
                    {
                        enrolledCourses.length ?
                            <div className='flex flex-wrap items-stretch gap-3 mt-3 h-[55vh] overflow-y-scroll'>
                                {
                                    enrolledCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            title={course.title}
                                            teacher={course.teacher}
                                            duration={course.duration}
                                            description={course.description}
                                            thumbnail={course.thumbnail}
                                            studentCount={course.total_students}
                                            slug={course.slug}
                                        />
                                    ))
                                }
                            </div>
                            :
                            <EmptyMessage />
                    }
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