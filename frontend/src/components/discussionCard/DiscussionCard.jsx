import { useState } from "react";

import { ChevronRight, SendHorizonal } from "lucide-react";

import teacherIcon from '../../assets/icons/teacher.png';

const DiscussionCard = ({ profile, author, role }) => {

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReply, setShowReply] = useState(false);

    return (
        <div className="container-border p-5 flex gap-4 mt-2">
            <div className="shrink-0">
                <img src={profile} alt="" className="aspect-square w-5 sm:w-8 md:w-10 rounded-full object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-text-black font-medium text-sm sm:text-base">{author}</h3>
                    {role === "instructor" && <InstructorBadge />}
                    <p className="text-[8px] sm:text-xs text-faded-text">2h ago</p>
                </div>

                <p className="text-xs sm:text-sm mt-1">
                    Great explanation of useEffect cleanup! The example with the event listener really helped me understand when and why to use cleanup functions.
                </p>
                <div className="mt-4 text-xs sm:text-sm flex items-center gap-5">
                    <p className="flex items-center gap-1 cursor-pointer" onClick={() => setShowReply((prev) => !prev)}>3 replies <ChevronRight className={`w-4 ${showReply && "rotate-90"}`} /></p>
                    <p
                        className="text-primary font-medium cursor-pointer hover:bg-primary-fade px-2 py-1 rounded-full"
                        onClick={() => setShowReplyInput((prev) => !prev)}>
                        Reply
                    </p>
                </div>
                <ReplyInput showReplyInput={showReplyInput} />

                {
                    showReply &&
                    <div>
                        <ReplyCard profile={profile} author={author} role={role} />
                        <ReplyCard profile={profile} author={author} role={role} />
                    </div>
                }
            </div>
        </div>
    );
};

const InstructorBadge = () => {
    return (
        <>
            <p className="hidden sm:block px-2 py-1 text-xs text-primary font-medium bg-primary-fade rounded-full">Instructor</p>
            <div className="block sm:hidden bg-primary-fade p-2 rounded-full">
                <img
                    src={teacherIcon}
                    alt="Instructor"
                    className="sm:hidden w-2 h-2 object-contain"
                />
            </div>
        </>

    );
};

const ReplyInput = ({ showReplyInput }) => {
    return (
        <div className={`flex items-center gap-3 transition-all duration-500 ${showReplyInput ? "translate-y-0 opacity-100" : "h-0 opacity-0 translate-y-5"} `}>
            <input type="text" id="" placeholder="Write your reply" className="placeholder:text-xs mt-3 border-b border-b-gray-400 w-full outline-0 text-xs" />
            <button className="p-2 bg-primary rounded-full self-baseline-last flex items-center justify-center cursor-pointer">
                <SendHorizonal className="text-white w-4 h-4" />
            </button>
        </div>
    );
};

const ReplyCard = ({ profile, author, role }) => {
    return (
        <div className="flex gap-4 mt-4 ">
            <div className="shrink-0">
                <img src={profile} alt="" className="aspect-square w-4 sm:w-8 rounded-full object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-text-black text-xs sm:text-sm font-medium">{author}</h3>
                    {role === "instructor" && <InstructorBadge />}
                    <p className="text-xs text-faded-text">2h ago</p>
                </div>

                <p className="text-xs mt-1">
                    Great explanation of useEffect cleanup! The example with the event listener really helped me understand when and why to use cleanup functions.
                </p>
            </div>
        </div>
    );
};


export default DiscussionCard;