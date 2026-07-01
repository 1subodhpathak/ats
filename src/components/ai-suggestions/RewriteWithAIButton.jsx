import Button from "../common/Button";

function RewriteWithAIButton({ onClick, loading = false, children = "Improve with AI" }) {
  return (
    <Button variant="outline" onClick={onClick} disabled={loading} className="px-3 py-2">
      {loading ? "Working..." : children}
    </Button>
  );
}

export default RewriteWithAIButton;
