import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { usePrivateApi } from "../../../hooks/usePrivateApi";
import { DATE_FORMAT } from "../../../config";

import AssignmentCard from "./assignmentCard/AssignmentCard";

const AssignmentTab = () => {
    const [assignemnts, setAssignments] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const { courseSlug } = useParams();
    const api = usePrivateApi();

    useEffect(() => {
        const getAssignments = async () => {
            try {
                const { data } = await api.get(`course/${courseSlug}/assignments/`);
                setAssignments(data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        getAssignments();
    }, []);

    return (
        <div>
            <h2 className="md:text-2xl font-semibold">Assignments</h2>
            <p className="text-faded-text text-xs md:text-sm">Manage and grade student assignments</p>
            <div className="mt-3">
                {!isLoading && assignemnts.length === 0 && <div className="flex items-center justify-center">No assignments found</div>}

                {
                    assignemnts.map(assignment => {
                        const date = new Date(assignment.due_date);

                        return (
                            <NavLink to={assignment.slug}
                                key={assignment.id}
                                state={{ assignment }}
                            >
                                <AssignmentCard
                                    title={assignment.title}
                                    description={assignment.description}
                                    dueDate={date.toLocaleDateString("en-IN", DATE_FORMAT)}
                                    totalSubmission={assignment.total_submissions}
                                    pendingCount={assignment.pending_count}
                                    gradedCount={assignment.graded_count}
                                    lessonName={assignment.lesson}
                                />
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default AssignmentTab;