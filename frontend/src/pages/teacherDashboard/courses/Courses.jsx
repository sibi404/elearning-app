import CourseCard from "./CourseCard";

const Courses = () => {
    return (
        <div className="mt-3 py-2 px-3 md:px-10">
            <CourseCard
                title="Advanced Mathematics"
                lastUpdate={"2 days ago"}
                students={45}
                videos={24}
                materials={18}
                progress={"78%"}
                active={true}
            />

            <CourseCard
                title="Physics Fundamentals"
                lastUpdate={"3 week ago"}
                students={38}
                videos={18}
                materials={12}
                progress={"65%"}
                active={false}
            />
        </div>
    );
};

export default Courses;