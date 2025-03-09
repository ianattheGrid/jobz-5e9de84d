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
  console.log('Route Debug:', {
    currentPath: window.location.pathname,
    availableRoutes: routes.map(r => ({ path: r.path, element: r.element?.type?.name })),
    dummyProfileRoute: routes.find(r => r.path === '/candidate/dummy-profile'),
    routesLength: routes.length
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route 
              path="/candidate/dummy-profile" 
              element={routes.find(r => r.path === '/candidate/dummy-profile')?.element} 
            />
            
            {routes.filter(route => route.path !== '/candidate/dummy-profile').map((route) => {
              const requiresAuth = route.path.startsWith('/dashboard') || 
                                 route.path.startsWith('/profile') || 
                                 route.path.startsWith('/interviews') || 
                                 route.path.startsWith('/create-vacancy') || 
                                 route.path.startsWith('/manage-jobs') || 
                                 route.path.startsWith('/candidate-search') ||
                                 route.path.startsWith('/recommendations');
              
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
