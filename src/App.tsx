import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { routes } from "@/config/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  // Get the project URL from window.location
  const pathname = window.location.pathname;
  const projectsMatch = pathname.match(/\/projects\/([^/]+)/);
  const basename = projectsMatch ? `/projects/${projectsMatch[1]}` : '';

  console.log('Current pathname:', pathname); // Debug log
  console.log('Current basename:', basename); // Debug log
  console.log('Projects match:', projectsMatch); // Debug log

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <AppLayout>
          <Routes>
            {routes.map((route) => {
              const requiresAuth = /\/(dashboard|profile|interviews|create-vacancy|manage-jobs|recommendations)/.test(route.path);
              
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    requiresAuth ? (
                      <ProtectedRoute>{route.element}</ProtectedRoute>
                    ) : (
                      route.element
                    )
                  }
                />
              );
            })}
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;