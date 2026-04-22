import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaginatedResponse, ApiResponse } from '../../domain/models/types/ApiResponse';

interface UsePaginationOptions<T> {
  fetchData: (page: number, pageSize: number) => Promise<ApiResponse<PaginatedResponse<T>>>;
  initialPage?: number;
  initialPageSize?: number;
  autoFetch?: boolean;
}

export function usePagination<T>({
  fetchData,
  initialPage = 1,
  initialPageSize = 50,
  autoFetch = true,
}: UsePaginationOptions<T>) {
  // Use a ref to store the latest fetch function and avoid infinite loops
  // when the consumer passes an inline function.
  const fetcherRef = useRef(fetchData);
  useEffect(() => {
    fetcherRef.current = fetchData;
  }, [fetchData]);

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (currentPage: number, currentPageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcherRef.current(currentPage, currentPageSize);
      if (response.success && response.data) {
        setData(response.data.items);
        setPage(response.data.page);
        setPageSize(response.data.pageSize);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPreviousPage(response.data.hasPreviousPage);
      } else {
        setError(response.message || 'Error fetching data');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error occurred during fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchItems(page, pageSize);
    }
  }, [page, pageSize, fetchItems, autoFetch]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= (totalPages || Infinity)) {
      setPage(newPage);
    }
  }, [totalPages]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const refetch = useCallback(() => {
    fetchItems(page, pageSize);
  }, [fetchItems, page, pageSize]);

  return {
    data,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    goToPage,
    changePageSize,
    refetch,
  };
}