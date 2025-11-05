import TimeAgo from 'react-timeago';

const AnnouncementCard = ({ title, content, course, sender, time }) => {

    const announcementDate = new Date(time);
    const now = new Date()

    const diffInMs = now - announcementDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    const isNew = diffInHours < 24;
    return (
        <div className="container-border p-3 mt-2">
            <div className="flex items-center justify-start gap-2">
                <h3 className="font-semibold text-text-black text-sm">{title}</h3>
                {isNew && (
                    <span className="text-white text-xs font-bold bg-orange-400 rounded-xl px-2 py-1">New</span>
                )}
            </div>
            <p className="text-xs text-faded-text py-3">{course} <span className="">|</span> {sender}</p>
            <p className="text-xs">{content}</p>
            <p className="text-[8px] text-right mt-2">
                <TimeAgo date={time} minPeriod={60} />
            </p>
        </div>
    );
};

export default AnnouncementCard;