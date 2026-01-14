interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export default function Logo({ onClick, className = '' }: LogoProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-200 cursor-pointer group ${className}`}
      aria-label="Reset calculation"
      title="Set semula pengiraan"
    >
      <img
        src="/blue_and_black_minimalist_brand_logo-removebg-preview.png"
        alt="rumahAdvisor logo"
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 transition-transform duration-200 group-hover:scale-105 object-contain"
      />

      <div className="flex items-baseline">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-white transition-all duration-200">
          rumah
        </span>
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white transition-all duration-200">
          Advisor
        </span>
      </div>
    </button>
  );
}
