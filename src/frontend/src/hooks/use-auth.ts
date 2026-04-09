import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";

export function useAuth() {
  const { loginStatus, login, clear, identity } = useInternetIdentity();
  const { actor } = useActor(createActor);

  const isAuthenticated = loginStatus === "success";

  const { data: adminPrincipal } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAdmin();
      } catch {
        return null;
      }
    },
    enabled: !!actor,
    staleTime: 60_000,
  });

  const isAdmin =
    isAuthenticated &&
    !!adminPrincipal &&
    !!identity &&
    identity.getPrincipal().toText() === adminPrincipal.toText();

  return {
    isAuthenticated,
    isAdmin,
    identity,
    loginStatus,
    login,
    logout: clear,
    adminPrincipal,
  };
}
