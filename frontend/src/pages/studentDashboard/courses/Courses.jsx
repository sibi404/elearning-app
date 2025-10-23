import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import './courses.css';

import CourseCard from '../../../components/courseCard/CourseCard';
import EmptyMessage from '../emptyMessage/EmptyMessage';

const Courses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const FILTERS = ["All", "Active", "Completed"]
    const { enrolledCourses } = useOutletContext();

    const filteredCourses = useMemo(() => {
        switch (FILTERS[activeIndex]) {
            case "Active":
                return enrolledCourses.filter((course) => !course.completed);
            case "Completed":
                return enrolledCourses.filter((course) => course.completed === true);
            default:
                return enrolledCourses;
        };
    }, [activeIndex, enrolledCourses]);

    const getEmptyMessage = () => {
        switch (FILTERS[activeIndex]) {
            case "Active":
                return {
                    title: "No Active courses found",
                    description: "Looks like you haven't started any courses yet."
                }
            case "Completed":
                return {
                    title: "No completed courses yet",
                    description: "Finish some courses to see them listed here."
                };
            default:
                return {
                    title: "No courses available",
                    description: "Enroll in a course to get started with your learning journey."
                }
        };
    };

    const { title, description } = getEmptyMessage();

    return (
        <div className="p-2 m-5 bg-white">
            <h2 className="font-bold text-2xl">My Courses</h2>
            <ul className="course-nav flex items-center justify-start gap-10 mt-4 text-xs sm:text-sm text-faded-text">
                {
                    FILTERS.map((link, index) => (
                        <li
                            key={index}
                            className={`${activeIndex === index && "active"} cursor-pointer`}
                            onClick={() => setActiveIndex(index)}
                        >{link}</li>
                    ))
                }
            </ul>
            {
                filteredCourses.length > 0 ?
                    <div className='flex flex-wrap items-stretch gap-3 mt-3 h-[55vh] overflow-y-scroll'>
                        {
                            filteredCourses.map((course) => (
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
                    <EmptyMessage title={title} description={description} />
            }
        </div>
    );
};

export default Courses;