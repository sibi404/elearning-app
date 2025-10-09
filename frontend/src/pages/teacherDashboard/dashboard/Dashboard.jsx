import InsightCard from "../../../components/insightCard/InsightCard";

import openBookIcon from '../../../assets/icons/open_book.png'
import usersIcon from '../../../assets/icons/users.png';
import videoIcon from '../../../assets/icons/video.png';

const Dashboard = () => {
    return (
        <main className="min-h-[70vh] mt-6 p-2">
            <div className='flex items-center justify-between flex-wrap p-3'>
                <InsightCard title={"Active Courses"} value={6} background={"blue-gradient"} img={openBookIcon} />
                <InsightCard title={"Total Students"} value={"150"} background={"green-gradient"} img={usersIcon} />
                <InsightCard title={"Videos Uploaded"} value={100} background={"orange-gradient"} img={videoIcon} />
            </div>
        </main>
    );
};

export default Dashboard;