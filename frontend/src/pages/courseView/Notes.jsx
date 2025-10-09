import SectionTitle from "./SectionTitle";

import { NotebookPen } from "lucide-react";

const Notes = () => {
    return (
        <div>
            <SectionTitle title={"My Notes"} icon={NotebookPen} />
            <textarea name="" id="" className="w-full h-[45vh] border border-gray-600 outline-0 resize-none rounded-md"></textarea>
            <div className="flex items-center justify-end">
                <button className="px-3 py-1 border border-primary rounded-md text-sm text-primary cursor-pointer font-medium hover:text-white hover:bg-primary text-right">Save</button>
            </div>
        </div>
    );
};

export default Notes;