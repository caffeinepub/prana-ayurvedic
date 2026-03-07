import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      phone,
      service,
    }: {
      name: string;
      phone: string;
      service: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitInquiry(name, phone, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}
