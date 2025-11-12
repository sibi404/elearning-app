import { useEffect, useState } from "react";
import AssignmentCard from "../../components/assignmentCard/AssignmentCard";
import SubmitAssignmentModal from "../../components/submitAssignmentModal/SubmitAssignmentModal";
import SectionTitle from "./SectionTitle";
import Error from "../../components/error/Error";

import { usePrivateApi } from "../../hooks/usePrivateApi";
import { showNetworkError } from "../../utils/toast/toastFunctions";
import { DATE_FORMAT } from "../../config";

const CourseAssignments = ({ lessonId, toast }) => {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const api = usePrivateApi();

    useEffect(() => {
        const getAssignments = async () => {
            try {
                const { data } = await api.get(`course/get-assignments/${lessonId}`);
                setAssignments(data);
            } catch (err) {
                console.log(err);
                if (err.request && !err.response) {
                    showNetworkError(toast);
                    setError("Network error");
                } else {
                    setError("Could not load assignments");
                }
            } finally {
                setIsLoading(false);
            }
        };

        getAssignments();

    }, [lessonId]);

    return (
        <div>
            {showAssignmentModal && selectedAssignment && (
                <SubmitAssignmentModal
                    onClose={() => setShowAssignmentModal(false)}
                    assignment={selectedAssignment}
                    setAssignments={setAssignments}
                    toast={toast}
                />
            )}
            <SectionTitle title="Course Assignments" />
            <div>
                {isLoading && <MaterialSkelton />}
                {error && <Error message={error} />}
                {!isLoading && !error && assignments.length === 0 && (
                    <NoAssignmentsFound />
                )}
                {
                    assignments.map((assignment) => {
                        const dueDate = new Date(assignment.due_date);
                        const submitDate = new Date(assignment.submitted_at);

                        return <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            dueDate={dueDate.toLocaleDateString("en-IN", DATE_FORMAT)}
                            submitDate={submitDate.toLocaleDateString("en-IN", DATE_FORMAT)}
                            setShowAssignmentModal={setShowAssignmentModal}
                            setSelectedAssignment={setSelectedAssignment}
                        />
                    })
                }
            </div>
        </div>
    );
};

export default CourseAssignments;


const SkeltonItem = () => {
    return (
        <div class="flex items-center justify-between">
            <div>
                <div class="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full "></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
    );
};

const MaterialSkelton = () => {
    return (
        <div role="status" class="w-full p-4 space-y-4  divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse md:p-6">
            <SkeltonItem />
            <SkeltonItem />
            <SkeltonItem />
            <SkeltonItem />
        </div>
    )
}

const NoAssignmentsFound = () => {
    return (
        <div className="min-h-28 flex items-center justify-center">
            <p className="text-center text-faded-text">No assignments available.</p>
        </div>
    );
};