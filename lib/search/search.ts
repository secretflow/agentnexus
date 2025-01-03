const NO_MATCH = 0;
const EXACT_MATCH = 5;
const EXACT_WORD_MULTIPLIER = 2;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const searchCache = new Map<string, any[]>();

// https://stackoverflow.com/a/9310752
function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function simpleSearchMatch(query: string, value: null | undefined | string): number {
  if (!value) {
    return NO_MATCH;
  }
  if (value === query) {
    return EXACT_MATCH;
  }

  const allWords = value.split(" ").length || 1;
  const exactRegExp = new RegExp(`\\b${query}\\b`, "ig");
  const includesRegExp = new RegExp(query, "ig");

  const exactWordOccurrences = [...value.toString().matchAll(exactRegExp)].length;
  const includesOccurrences = [...value.toString().matchAll(includesRegExp)].length;
  return (EXACT_WORD_MULTIPLIER * exactWordOccurrences + includesOccurrences) / allWords;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function simpleSearch<T extends Record<string, any>>(
  products: T[],
  weights: Partial<Record<keyof T, number>>,
  query: string,
): T[] {
  if (searchCache.has(query)) {
    return searchCache.get(query) || [];
  }
  const escapedQuery = escapeRegExp(query);

  const matches = products
    .map((product) => {
      const score = Object.entries(weights).reduce((score, [field, weight]) => {
        if (!weight) {
          return score;
        }

        return score + weight * simpleSearchMatch(escapedQuery, product[field]);
      }, 0);

      if (score > 0) {
        return { id: product.id, score };
      }

      return null;
    })
    .filter((result) => result !== null)
    .sort((a, b) => b.score - a.score);

  const result = matches.map((s) => products.find((p) => p.id === s.id)).filter((p) => !!p);

  searchCache.set(query, result);

  return result;
}
