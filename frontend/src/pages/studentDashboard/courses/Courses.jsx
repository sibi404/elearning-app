import { useState } from 'react';
import './courses.css';

import CourseCard from '../../../components/courseCard/CourseCard';

const Courses = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const links = ["All", "Active", "Completed"]
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
            <div className='flex flex-wrap items-center justify-between mt-3 overflow-y-scroll'>
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
            </div>
        </div>
    );
};

export default Courses;