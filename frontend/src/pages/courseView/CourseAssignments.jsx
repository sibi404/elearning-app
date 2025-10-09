import AssignmentCard from "../../components/assignmentCard/AssignmentCard";
import SectionTitle from "./SectionTitle";

const CourseAssignments = () => {
    return (
        <div>
            <SectionTitle title="Course Assignments" />
            <div>
                <AssignmentCard
                    status={"Submitted"}
                    title={"React Hook Implementation"}
                    description={"Create a custom hook for data fetching and implement it in a component"}
                    dueDate="Jan 10, 2026"
                    submitDate="Jan 8, 2026"
                />

                <AssignmentCard
                    status={"Pending"}
                    title={"Performance Optimization Project"}
                    description={"Optimize a React application using memo, useMemo, and useCallback"}
                    dueDate={"Jan 10, 2026"}
                    submitDate={"Jan 8, 2026"}
                />
            </div>
        </div>
    );
};

export default CourseAssignments;