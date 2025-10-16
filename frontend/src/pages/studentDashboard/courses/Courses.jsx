import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import './courses.css';

import CourseCard from '../../../components/courseCard/CourseCard';
import EmptyMessage from '../emptyMessage/EmptyMessage';

const Courses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const links = ["All", "Active", "Completed"]
    const { enrolledCourses } = useOutletContext();
    return (
        <div className="p-2 m-5 bg-white">
            <h2 className="font-bold text-2xl">My Courses</h2>
            <ul className="course-nav flex items-center justify-start gap-10 mt-4 text-xs sm:text-sm text-faded-text">
                {
                    links.map((link, index) => (
                        <li
                            key={index}
                            className={`${activeIndex === index && "active"} cursor-pointer`}
                            onClick={() => setActiveIndex(index)}
                        >{link}</li>
                    ))
                }
            </ul>
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
    );
};

export default Courses;