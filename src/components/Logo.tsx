interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export default function Logo({ onClick, className = '' }: LogoProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer group ${className}`}
      aria-label="Reset calculation"
      title="Set semula pengiraan"
    >
      <svg
        viewBox="0 0 40 40"
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 transition-transform duration-200 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L6 17V34C6 35.1046 6.89543 36 8 36H16V26C16 24.8954 16.8954 24 18 24H22C23.1046 24 24 24.8954 24 26V36H32C33.1046 36 34 35.1046 34 34V17L20 6Z"
          stroke="#2C3E7C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 13L20 7L28 13"
          stroke="#2C3E7C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 16H18"
          stroke="#2C3E7C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex items-baseline">
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-white transition-all duration-200">
          rumah
        </span>
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-200">
          Advisor
        </span>
      </div>
    </button>
  );
}
