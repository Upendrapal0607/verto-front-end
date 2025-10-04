import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600 mb-6">The page you are looking for doesn’t exist.</p>
    <Link
      to="/employees"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
