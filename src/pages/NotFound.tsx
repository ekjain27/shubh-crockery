import { Link } from "react-router-dom";
export function NotFound({
  title = "Page not found",
  message = "We couldn’t find this page. There’s still plenty to explore in our collection.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="container page empty">
      <p className="eyebrow">404 · LET’S FIND YOUR WAY BACK</p>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link className="button" to="/shop">
        Browse products →
      </Link>
      <Link className="text-link" to="/">
        Back to home
      </Link>
    </div>
  );
}
