import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/custom-fetch";

export interface UseFetchDataOptions<T> {
  url: string;
  params?: Record<string, any>;
  isEnabled?: boolean | (() => boolean);
  queryOptions?: Omit<any, "queryKey" | "queryFn">;
  retry?: number;
}

const useFetchQuery = <T>({
  url,
  params = {},
  isEnabled = true,
  queryOptions,
  retry = 0,
}: UseFetchDataOptions<T>) => {
  const queryKey = [url, { ...params }];

  const { data, isLoading, error, isFetching, isSuccess } = useQuery<T, Error>({
    queryKey,
    queryFn: () => fetchGet(url, params),
    enabled: typeof isEnabled === "function" ? isEnabled() : isEnabled,
    retry,
    ...queryOptions,

    // refetchInterval
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    isSuccess,
  };
};

export default useFetchQuery;
