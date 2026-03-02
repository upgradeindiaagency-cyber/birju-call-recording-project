import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Helper to log and parse Zod errors
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Data validation failed for ${label}`);
  }
  return result.data;
}

export function useCalls() {
  return useQuery({
    queryKey: [api.calls.list.path],
    queryFn: async () => {
      const res = await fetch(api.calls.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch call records");
      const data = await res.json();
      return parseWithLogging(api.calls.list.responses[200], data, "calls.list");
    },
  });
}

export function useCall(id: number) {
  return useQuery({
    queryKey: [api.calls.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.calls.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch call record");
      const data = await res.json();
      return parseWithLogging(api.calls.get.responses[200], data, `calls.get(${id})`);
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useUploadCall() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.calls.upload.path, {
        method: api.calls.upload.method,
        body: formData,
        credentials: "include",
        // Note: Do NOT set Content-Type header when sending FormData
        // The browser will automatically set it with the correct boundary
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to analyze call. Please try again.");
      }

      const data = await res.json();
      return parseWithLogging(api.calls.upload.responses[201], data, "calls.upload");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calls.list.path] });
      toast({
        title: "Call Analyzed",
        description: "The call record has been successfully uploaded and analyzed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
