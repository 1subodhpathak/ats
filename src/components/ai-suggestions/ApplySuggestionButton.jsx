import Button from "../common/Button";

function ApplySuggestionButton({ onApply, onDismiss }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onApply}>Apply suggestion</Button>
      <Button variant="ghost" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  );
}

export default ApplySuggestionButton;
