import { useEffect, useState } from "react";

import CourseCard from "./CourseCard";

import { usePrivateApi } from "../../../hooks/usePrivateApi";

const Courses = () => {
    const api = usePrivateApi();

    const [courseList, setCourseList] = useState([]);

    const getCourseList = async () => {
        try {
            const { data } = await api.get('course/teacher-course-list/');
            setCourseList(data);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        getCourseList();
    }, [])

    return (
        <div className="mt-3 py-2 px-3 md:px-10">
            {
                courseList.map((course) => (
                    <CourseCard
                        key={course.id}
                        title={course.title}
                        progress={`${parseInt(course.overall_progress)}%`}
                        lastUpdate={"2 days ago"}
                        students={course.total_students}
                        videos={course.total_lessons}
                        materials={course.total_materials}
                        slug={course.slug}
                        active={true}
                    />
                ))
            }
        </div>
    );
};

export default Courses;