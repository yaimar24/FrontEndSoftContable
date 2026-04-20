/**
 * Builds a URL query string from a params object, skipping null/undefined/empty values.
 */
export const buildQueryParams = (params: Record<string, string | number | boolean | undefined | null>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};
