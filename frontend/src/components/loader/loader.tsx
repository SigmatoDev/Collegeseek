const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white/80">
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        {/* Outer animated ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-30"></div>
          <svg
            className="animate-spin h-16 w-16 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>

        {/* Loading text */}
        <p className="text-gray-700 font-semibold text-xl tracking-wide">
          Fetching for you...
        </p>
        <span className="text-sm text-gray-500">Please wait a moment</span>
      </div>
    </div>
  );
};

export default Loader;
