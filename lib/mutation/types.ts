export interface MutationOptions<TData, TVariables> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onMutate?: (variables: TVariables) => void;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: unknown) => void;
    onSettled?: (data: TData | undefined, variables: TVariables | undefined, error: unknown | null) => void;
}
