import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Using the manually registered routes from integration but defined in contract for types
export function useConversations() {
  return useQuery({
    queryKey: [api.chat.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.chat.conversations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.chat.conversations.list.responses[200].parse(await res.json());
    },
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: [api.chat.conversations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.chat.conversations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return api.chat.conversations.get.responses[200].parse(await res.json());
    },
    // Poll for new messages every 3 seconds if not using sockets/SSE for reads (integration uses SSE for writes only)
    refetchInterval: 3000, 
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(api.chat.conversations.create.path, {
        method: api.chat.conversations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return api.chat.conversations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.chat.conversations.list.path] }),
  });
}

// NOTE: Sending messages is handled via direct fetch/SSE in the component to support streaming
