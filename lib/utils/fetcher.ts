interface SWRError extends Error {
  status: number;
}

// biome-ignore lint/suspicious/noExplicitAny: fetcher is a generic function
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.json();
    const err = new Error(error.message) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function fetcherWithApiKey<JSON = any>(
  apiKey: string,
): (input: RequestInfo, init?: RequestInit) => Promise<JSON> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  return (input: RequestInfo, init?: RequestInit) => {
    return fetcher(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...headers,
      },
    });
  };
}
