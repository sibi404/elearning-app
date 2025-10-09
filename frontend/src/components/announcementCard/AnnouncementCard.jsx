const AnnouncementCard = () => {
    return (
        <div className="container-border p-3 mt-2">
            <div className="flex items-center justify-start gap-2">
                <h3 className="font-semibold text-text-black text-sm">New Resources Available</h3>
                <span className="text-white text-xs font-bold bg-orange-400 rounded-xl px-2 py-1">New</span>
            </div>
            <p className="text-xs text-faded-text py-3">Advanced React Development <span className="">|</span> Sara John</p>
            <p className="text-xs">I've uploaded additional practice exercises for React hooks. Check the materials section.</p>
            <p className="text-[8px] text-right mt-2">2 hours ago</p>
        </div>
    );
};

export default AnnouncementCard;