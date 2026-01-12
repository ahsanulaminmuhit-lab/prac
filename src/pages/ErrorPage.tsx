import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-8">
          {error?.statusText ||
            error?.message ||
            "Sorry, an unexpected error occurred."}
        </p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
