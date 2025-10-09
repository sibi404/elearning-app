const DeadlineCard = () => {
    return (
        <div className="container-border p-3 mt-2">
            <span className="text-white text-xs font-bold bg-red-500 rounded-xl px-2 py-1">2 days left</span>
            <h6 className="font-medium text-text-black text-sm py-1 mt-2">Assignment 4 : State Management</h6>
            <p className="text-xs text-faded-text py-1">Advanced React Development</p>
            <p className="text-xs text-faded-text">Due: Sep 26,2025</p>
        </div>
    );
};

export default DeadlineCard;