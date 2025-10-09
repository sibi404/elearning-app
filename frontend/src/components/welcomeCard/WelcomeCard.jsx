import './welcomeCard.css';
import workingIllustration from '../../assets/images/working-illustration.png'

const WelcomeCard = () => {
    return (
        <div className="welcome-card w-full bg-primary px-[72px] rounded-2xl flex items-center justify-between text-[#FAFAFA]">
            <div>
                <h2 className='text-xl md:text-3xl font-medium'>Good Morning</h2>
                <p className='text-xs sm:text-sm md:text-[16px] font-medium mt-1'>
                    You've learned <span className='text-[#F83D00] font-bold'>40% of your</span> goal <br /> Keep it up and improve your results!
                </p>
            </div>
            <div className='h-full'>
                <img src={workingIllustration} alt="" className='w-[150px] sm:block sm:w-[200px] md:w-auto' />
            </div>
        </div>
    );
};

export default WelcomeCard;