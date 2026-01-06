import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertVoiceSample } from "@shared/schema";

export function useVoiceSamples() {
  return useQuery({
    queryKey: [api.voiceSamples.list.path],
    queryFn: async () => {
      const res = await fetch(api.voiceSamples.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch voice samples");
      return api.voiceSamples.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateVoiceSample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertVoiceSample) => {
      const validated = api.voiceSamples.create.input.parse(data);
      const res = await fetch(api.voiceSamples.create.path, {
        method: api.voiceSamples.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.voiceSamples.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create voice sample");
      }
      return api.voiceSamples.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.voiceSamples.list.path] }),
  });
}

export function useDeleteVoiceSample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.voiceSamples.delete.path, { id });
      const res = await fetch(url, {
        method: api.voiceSamples.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete voice sample");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.voiceSamples.list.path] }),
  });
}
