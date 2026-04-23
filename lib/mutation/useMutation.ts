import { useCallback, useState } from 'react';
import { MutationOptions } from './types';

export function useMutation<TData, TVariabels>({
    mutationFn,
    onMutate,
    onSuccess,
    onError,
    onSettled,
}: MutationOptions<TData, TVariabels>) {
    const [data, setData] = useState<TData | undefined>();
    const [error, setError] = useState<unknown | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const reset = useCallback(() => {
        setData(undefined);
        setError(null);
        setIsPending(false);
        setIsSuccess(false);
        setIsError(false);
    }, []);

    const mutate = useCallback(
        async (variables: TVariabels) => {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            setIsError(false);

            try {
                onMutate?.(variables);

                const data = await mutationFn(variables);

                setData(data);
                setIsSuccess(true);
                onSuccess?.(data, variables);
            } catch (error) {
                setError(error);
                setIsError(true);
                onError?.(error);
            } finally {
                setIsPending(false);
                onSettled?.(data, variables, error);
            }
        },
        [mutationFn],
    );

    return {
        mutate,
        reset,
        data,
        error,
        isSuccess,
        isPending,
        isError,
    };
}
