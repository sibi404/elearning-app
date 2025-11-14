import { DATE_FORMAT } from "../config";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT);
};

export default formatDate