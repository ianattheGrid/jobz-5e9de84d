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
  const pathname = window.location.pathname;
  const projectsMatch = pathname.match(/^\/projects\/([^/]+)/);
  const basename = projectsMatch ? `/projects/${projectsMatch[1]}` : undefined;

  console.log('Route Debug:', {
    pathname,
    basename,
    projectsMatch,
    availableRoutes: routes.map(r => r.path)
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <AppLayout>
          <Routes>
            {routes.map((route) => {
              const requiresAuth = /^\/(dashboard|profile|interviews|create-vacancy|manage-jobs|recommendations)/.test(route.path);
              
              console.log('Processing route:', {
                path: route.path,
                requiresAuth,
                element: route.element ? 'Present' : 'Missing'
              });
              
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