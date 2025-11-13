import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePrivateApi } from "../../../hooks/usePrivateApi";

import StudentOverViewCard from "../studentOverviewCard/StudentOverviewCard";

const StudentTab = () => {
    const [studentData, setStudentData] = useState([]);
    const { courseSlug } = useParams();
    const api = usePrivateApi();

    useEffect(() => {

        const getStudentDetails = async () => {
            try {
                const { data } = await api.get(`course/${courseSlug}/students/`);
                setStudentData(data);
            } catch (err) {
                console.log(err);
            }
        }

        getStudentDetails();

    }, []);

    return (
        <div>
            {
                studentData.map(student => (
                    <StudentOverViewCard
                        key={student.student_id}
                        name={student.name}
                        email={student.email}
                        progress={student.progress}
                        totalAssignment={student.total_assignments}
                        assignmentSubmitted={student.assignments_submitted}
                    />
                ))
            }
        </div>
    );
};


export default StudentTab;