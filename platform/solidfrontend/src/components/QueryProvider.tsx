import { QueryClientProvider } from "@tanstack/solid-query";
import type { ParentComponent } from "solid-js";
import { queryClient } from "@/lib/query-client";

export const QueryProvider: ParentComponent = (props) => {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    );
};
