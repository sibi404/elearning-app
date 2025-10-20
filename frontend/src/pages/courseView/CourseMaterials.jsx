import { FileText, Download } from "lucide-react";
import { useEffect, useState, memo, useCallback } from "react";

import SectionTitle from "./SectionTitle";
import Error from "../../components/error/Error";

import { usePrivateApi } from "../../hooks/usePrivateApi";
import { formatBytes } from "../../utils/course/formatSize";

const CourseMaterials = ({ lessonId }) => {
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const api = usePrivateApi();

    const getLessonMaterials = useCallback(async () => {
        try {
            const respone = await api.get(`course/get-lesson-materials/${lessonId}`);
            setMaterials(respone.data);
        } catch (err) {
            console.log(err);
            setError("Could not load course materials.");
        } finally {
            setIsLoading(false);
        };
    }, [lessonId]);


    useEffect(() => {
        getLessonMaterials();
    }, [getLessonMaterials]);

    return (
        <div>
            <SectionTitle title="Course Materials" />
            <div>
                {isLoading && <p className="text-center">Loading materials...</p>}
                {error && <Error message={error} />}
                {!isLoading && !error && materials.length === 0 && (
                    <p className="text-center text-faded-text">No materials available.</p>
                )}
                {
                    materials.map((material) => (
                        <MaterialCard
                            key={material.id}
                            title={material.title}
                            type={material.material_type.toUpperCase()}
                            size={formatBytes(material.size)}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default CourseMaterials;

const MaterialCard = memo(({ title, type, size }) => {
    return (
        <div className="material-card container-border px-4 py-2 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="text-primary w-5" />
                <div>
                    <h3 className="font-medium text-sm md:text-base">{title}</h3>
                    <p className="text-faded-text text-xs md:text-sm">{type} <span className="font-bold">.</span> {size}</p>
                </div>
            </div>
            <button className="container-border p-2 md:p-3 cursor-pointer hover:bg-primary hover:border-transparent group" title="Download">
                <Download className="group-hover:text-white w-5 h-5 md:w-auto md:h-auto" />
            </button>
        </div>
    );
});