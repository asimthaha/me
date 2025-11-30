import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        {/* SVG Illustration */}
        <svg
          className="mx-auto mb-6 w-64 h-64 md:w-80 md:h-80 text-blue-500 opacity-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" strokeWidth="1.5" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
          <circle
            cx="12"
            cy="14"
            r="9"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-300"
          />
          <path
            d="M19.07 4.93L4.93 19.07"
            className="text-gray-300"
            strokeWidth="0.2"
          />
        </svg>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Oops! We couldn't find that page.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
