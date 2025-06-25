import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <img
        src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
        alt="404"
        className="mx-auto"
      />
      <h2 className="text-xl font-bold mt-4">404 - Page Not Found</h2>
      <Link to="/" className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Back to Home
      </Link>
    </div>
  );
}
