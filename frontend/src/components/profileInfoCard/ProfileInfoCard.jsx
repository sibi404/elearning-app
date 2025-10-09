const ProfileInfoCard = ({ icon: Icon, detail, title }) => {
    return (
        <div className='flex items-center justify-start gap-5 basis-full md:basis-[48%] mt-2 p-3 bg-amber-200 rounded-lg'>
            <div className='p-3 sm:p-5 bg-red-300 rounded-xl'>
                <Icon className='text-primary text-xl' />
            </div>
            <div>
                <h5 className='text-faded-text text-xs sm:text-sm'>{title}</h5>
                <p className="text-sm sm:text-base">{detail}</p>
            </div>
        </div>
    );
};

export default ProfileInfoCard;