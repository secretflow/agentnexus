export const getSearchParams = (url: string) => {
  const params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const createQueryString = (data: Record<string, string>) => {
  const searchParams = new URLSearchParams();

  for (const key in data) {
    searchParams.set(key, data[key]);
  }

  return searchParams.toString();
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
