import type { VariableValue } from "./types";

export function VariableValueGetter({
  variableValues,
}: {
  variableValues: VariableValue;
}) {
  return (
    <div className="space-y-2">
      {Object.entries(variableValues).map(([key, value]) => (
        <div key={key} className="rounded-sm border p-2">
          <div className="text-gray-700 text-sm">{key}:</div>
          <pre className="mt-1 whitespace-pre-wrap text-gray-500 text-xs">{value}</pre>
        </div>
      ))}
    </div>
  );
}
