import Card from "../common/Card";

function KeywordGroup({ title, items, tone }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function JDKeywordExtractor({ result }) {
  if (!result) {
    return null;
  }

  return (
    <Card className="space-y-5">
      <h3 className="text-xl font-semibold text-slate-900">Keyword insights</h3>
      <KeywordGroup
        title="Matched keywords"
        items={result.matched_keywords}
        tone="bg-emerald-100 text-emerald-700"
      />
      <KeywordGroup
        title="Missing keywords"
        items={result.missing_keywords}
        tone="bg-rose-100 text-rose-700"
      />
      <KeywordGroup
        title="Recommended additions"
        items={result.recommended_keywords}
        tone="bg-amber-100 text-amber-700"
      />
      {result.placement_suggestions?.length ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900">Where to add them</h4>
          <div className="space-y-2">
            {result.placement_suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export default JDKeywordExtractor;
