import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { router } from "./Routing/AppRouting.jsx";
import TokenProvider from "./context/TokenContext.jsx";
import UserProvider from "./context/UserContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const query = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={query}>
    <StrictMode>
      <TokenProvider>
        <UserProvider>
          <HeroUIProvider>
            <RouterProvider router={router}>
              <App />
            </RouterProvider>
          </HeroUIProvider>
        </UserProvider>
      </TokenProvider>
    </StrictMode>
  </QueryClientProvider>,
);
