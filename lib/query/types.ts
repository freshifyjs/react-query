export interface QueryOptions<TData> {
    queryKey: any[];
    queryFn: () => Promise<TData>;
    enabled?: boolean;
    retry?: number;
    retryDelay?: number;
}
