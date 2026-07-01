import Toast from "../common/Toast";
import SuggestionCard from "./SuggestionCard";

function LineAnalysisPanel({ suggestion, onApply, onDismiss }) {
  if (!suggestion?.open) {
    return null;
  }

  if (suggestion.error) {
    return <Toast message={suggestion.error} variant="error" />;
  }

  return (
    <SuggestionCard
      suggestion={suggestion}
      onApply={onApply}
      onDismiss={onDismiss}
    />
  );
}

export default LineAnalysisPanel;
