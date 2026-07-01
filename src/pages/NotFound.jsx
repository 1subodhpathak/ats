import { Link } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";

function NotFound() {
  return (
    <div className="page-shell">
      <Card className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          404
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">Page not found</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The route does not exist yet or the URL is incorrect.
        </p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Go back home</Button>
        </Link>
      </Card>
    </div>
  );
}

export default NotFound;
