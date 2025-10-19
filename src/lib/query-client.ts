import { QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === "web" ? 1 : 3,
      refetchOnReconnect: true,
      retryDelay: Platform.OS === "web" ? 1000 : 2000,
      staleTime: 60000,
      gcTime: 300000,
    },
  },
});
