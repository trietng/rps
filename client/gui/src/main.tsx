import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { Dapp } from "@/components/Dapp";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.
createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <NextUIProvider>
            <Dapp />
        </NextUIProvider>
    </QueryClientProvider>
);