import SectionTitle from "./SectionTitle";
import DiscussionCard from "../../components/discussionCard/DiscussionCard";

import sampleProfile2 from '../../assets/images/sample-profile-2.jpg';
import sampleProfile from '../../assets/images/sample-profile.jpg';

import { ArrowUp, Cherry, ChevronDown, ChevronRight, SendHorizonal } from "lucide-react";

const Discussion = () => {

    return (
        <div className="">
            <SectionTitle title={"Start New Discussion"} />
            <div className="relative">
                <textarea name="" id="" className="border border-gray-500 w-full h-30 outline-0 p-3 rounded-lg resize-none placeholder:text-sm" placeholder="Ask a question or share your thoughts about this lesson">
                </textarea>
                <button className="absolute right-3 bottom-5 bg-primary p-2 rounded-full cursor-pointer" title="Submit">
                    <ArrowUp className="text-white w-4 h-4" />
                </button>
            </div>

            <SectionTitle title={"Discussion Forum"} />
            <div>
                <DiscussionCard profile={sampleProfile} author="Lisa Rodriguez" role="student" />
                <DiscussionCard profile={sampleProfile2} author="Sara Johnson" role="instructor" />
            </div>
        </div>
    );
};

export default Discussion;