import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

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
        <div className="min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div>
                    <h2 className="md:text-2xl font-bold mb-2">Assignments</h2>
                    <p className="text-faded-text text-sm md:text-base">Manage and grade student assignments</p>
                </div>
                <NavLink to="add">
                    <button
                        className="flex items-center justify-center w-full gap-2 mt-3 sm:mt-0 px-3 md:px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-medium text-sm md:text-base"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Assignment
                    </button>
                </NavLink>
            </div>
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