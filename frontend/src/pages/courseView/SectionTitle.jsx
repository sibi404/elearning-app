const SectionTitle = ({ title, icon: Icon }) => {
    return (
        <h2 className=" text-base md:text-lg lg:text-xl text-text-black mt-3 font-medium py-5 flex items-center gap-1">
            {Icon && <Icon className="w-5" />}
            {title}
        </h2>
    );
};

export default SectionTitle;