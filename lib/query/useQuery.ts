import { useEffect, useState } from 'react';
import { QueryOptions } from './types';

export function useQuery<TData>({ queryKey, queryFn, enabled = true, retry = 0, retryDelay = 1000 }: QueryOptions<TData>) {
    const [data, setData] = useState<TData | undefined>();
    const [error, setError] = useState<unknown | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const refetch = async () => {
        setError(null);
        setIsPending(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            const response = await queryFn();

            setData(response);
            setIsSuccess(true);
        } catch (error) {
            setError(error);
            setIsError(true);
            throw error;
        } finally {
            setIsPending(false);
        }
    };

    const refetchWithRetry = async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        for (let attempt = 0; attempt <= retry; attempt++) {
            try {
                await refetch();
                return;
            } catch (error) {
                if (attempt === retry) {
                    throw error;
                }

                await delay(retryDelay);
            }
        }
    };

    useEffect(() => {
        if (!queryFn || !enabled) return;
        refetchWithRetry();
    }, [...queryKey, enabled]);

    return {
        refetch,
        refetchWithRetry,
        data,
        error,
        isPending,
        isSuccess,
        isError,
    };
}
