import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col gap-8 place-items-center place-content-center">
      <p className="text-xl">404 | Page does not exist</p>

      <Link to="/">
        <p className="text-xl hover:text-orange-400">Go to homepage</p>
      </Link>
    </div>
  );
}
