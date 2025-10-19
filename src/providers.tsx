import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>{children}</ActionSheetProvider>
    </QueryClientProvider>
  );
}
