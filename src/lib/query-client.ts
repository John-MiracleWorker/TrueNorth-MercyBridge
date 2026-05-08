import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return 'Please try again.';
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) {
        return;
      }

      const mutationMeta = mutation.meta as
        | { errorMessage?: string; errorTitle?: string; skipGlobalErrorToast?: boolean }
        | undefined;

      if (mutationMeta?.skipGlobalErrorToast) {
        return;
      }

      toast({
        title: mutationMeta?.errorTitle ?? 'Something went wrong',
        description: mutationMeta?.errorMessage ?? getErrorMessage(error),
        variant: 'destructive',
      });
    },
  }),
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
