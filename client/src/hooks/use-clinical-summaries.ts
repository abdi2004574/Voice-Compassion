import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertClinicalSummary } from "@shared/schema";

export function useClinicalSummaries() {
  return useQuery({
    queryKey: [api.clinicalSummaries.list.path],
    queryFn: async () => {
      const res = await fetch(api.clinicalSummaries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clinical summaries");
      return api.clinicalSummaries.list.responses[200].parse(await res.json());
    },
  });
}

export function useClinicalSummary(id: number) {
  return useQuery({
    queryKey: [api.clinicalSummaries.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.clinicalSummaries.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch clinical summary");
      return api.clinicalSummaries.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateClinicalSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertClinicalSummary) => {
      const validated = api.clinicalSummaries.create.input.parse(data);
      const res = await fetch(api.clinicalSummaries.create.path, {
        method: api.clinicalSummaries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.clinicalSummaries.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create clinical summary");
      }
      return api.clinicalSummaries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.clinicalSummaries.list.path] }),
  });
}
