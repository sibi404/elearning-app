import { FileText, Download } from "lucide-react";
import SectionTitle from "./SectionTitle";

const CourseMaterials = () => {
    return (
        <div>
            <SectionTitle title="Course Materials" />
            <div>
                <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary w-5" />
                        <div>
                            <h3 className="font-medium text-sm md:text-base">Additional Reading Materials</h3>
                            <p className="text-faded-text text-xs md:text-sm">PDF <span className="font-bold">.</span> 3.4 MB</p>
                        </div>
                    </div>
                    <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary group" title="Download">
                        <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
                    </button>
                </div>

                <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary w-5" />
                        <div>
                            <h3 className="font-medium text-sm md:text-base">Additional Reading Materials</h3>
                            <p className="text-faded-text text-xs md:text-sm">PDF <span className="font-bold">.</span> 3.4 MB</p>
                        </div>
                    </div>
                    <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary group" title="Download">
                        <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
                    </button>
                </div>

                <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary w-5" />
                        <div>
                            <h3 className="font-medium text-sm md:text-base">Additional Reading Materials</h3>
                            <p className="text-faded-text text-xs md:text-sm">PDF <span className="font-bold">.</span> 3.4 MB</p>
                        </div>
                    </div>
                    <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary group" title="Download">
                        <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
                    </button>
                </div>

                <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary w-5" />
                        <div>
                            <h3 className="font-medium text-sm md:text-base">Additional Reading Materials</h3>
                            <p className="text-faded-text text-xs md:text-sm">PDF <span className="font-bold">.</span> 3.4 MB</p>
                        </div>
                    </div>
                    <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary group" title="Download">
                        <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
                    </button>
                </div>

                <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary w-5" />
                        <div>
                            <h3 className="font-medium text-sm md:text-base">Additional Reading Materials</h3>
                            <p className="text-faded-text text-xs md:text-sm">PDF <span className="font-bold">.</span> 3.4 MB</p>
                        </div>
                    </div>
                    <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary group" title="Download">
                        <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
                    </button>
                </div>


            </div>
        </div>
    );
};

export default CourseMaterials;