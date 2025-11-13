import AssignmentCard from "./assignmentCard/AssignmentCard";

const AssignmentTab = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold">Assignments</h2>
            <p className="text-faded-text text-sm">Manage and grade student assignments</p>
            <div className="mt-3">
                <AssignmentCard />
                <AssignmentCard />
            </div>
        </div>
    );
};

export default AssignmentTab;