import SectionTitle from "./SectionTitle";

const CourseOverview = ({ about }) => {
    console.log(about);
    return (
        <div>
            <SectionTitle title="About This Lesson" />
            <p className='text-faded-text text-sm md:text-base'>
                {about}
            </p>

            <h2 className='md:text-xl font-medium py-5'>Learning Objectives</h2>
            <ul className='list-disc list-inside text-faded-text text-sm'>
                <li>Understand the Linux file system structure</li>
                <li>Use essential terminal commands efficiently</li>
                <li>Manage files and directories</li>
                <li>Work with user permissions and processes</li>
                <li>Navigate and operate within the Linux environment confidently</li>
            </ul>
        </div>
    );
};

export default CourseOverview;