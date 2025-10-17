import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "@/providers/query-client-provider";
import {
  fetchDelete,
  fetchPatch,
  fetchPost,
  fetchPut,
} from "@/lib/custom-fetch";
import { showToastNotification } from "@/components/toast/show-toast-notification";

interface PostDataMutationInput<TPostData> {
  url: string;
  postData?: TPostData;
  isMultipart?: boolean;
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
}

interface UsePostDataOptions<TPostData> {
  invalidateQueries?: string[];
  onSuccess?: (data: any) => void;
  doNotShowToast?: boolean;
  mutationOptions?: Omit<
    UseMutationOptions<any, Error, PostDataMutationInput<TPostData>>,
    "mutationFn"
  >;
  onError?: (error: any) => void;
}

type UsePostDataResult<TPostData> = UseMutationResult<
  any,
  Error,
  PostDataMutationInput<TPostData>
>;

const executeRequest = async <TPostData>({
  url,
  postData,
  isMultipart = false,
  method = "POST",
}: PostDataMutationInput<TPostData>) => {
  switch (method) {
    case "PATCH":
      return await fetchPatch(url, postData, isMultipart);
    case "PUT":
      return await fetchPut(url, postData, isMultipart);
    case "DELETE":
      return await fetchDelete(url, postData);
    default:
      return await fetchPost(url, postData, isMultipart);
  }
};

const handleError = (
  error: unknown,
  onError?: (error: any) => void,
  doNotShowToast?: boolean
) => {
  let errorMessage;

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "error" in error) {
    errorMessage = error.error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "An unexpected error occurred.";
  }

  if (onError) onError(error);

  if (!doNotShowToast) {
    return showToastNotification({
      message: String(errorMessage),
      variant: "error",
    });
  }
};

const handleSuccess = (
  data: any,
  onSuccess?: (data: any) => void,
  doNotShowToast?: boolean
) => {
  if (onSuccess) onSuccess(data);

  if (!doNotShowToast && data?.message) {
    return showToastNotification({
      message: data.message,
      variant: data.success === false ? "error" : "success",
    });
  }
};

export const usePostData = <TPostData = any>({
  invalidateQueries = [],
  onSuccess,
  mutationOptions,
  onError,
  doNotShowToast = false,
}: UsePostDataOptions<TPostData> = {}): UsePostDataResult<TPostData> => {
  return useMutation<any, Error, PostDataMutationInput<TPostData>>({
    mutationFn: async (mutationInput) => {
      return await executeRequest(mutationInput);
    },
    onSuccess: (data) => handleSuccess(data, onSuccess, doNotShowToast),
    onError: (error) => handleError(error, onError, doNotShowToast),
    onSettled: () => {
      if (invalidateQueries.length) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: [queryKey],

            // refetchType: 'all'
          });
        });
      }
    },
    ...mutationOptions,
  });
};
