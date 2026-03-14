// File: client/src/App.jsx
// Final version for Phase 2 RBAC.
 
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Header from "./components/Headers";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";

function Layout() {
  return (
    <>
      
      <Outlet />
       
    </>
  );
}

function App() {
  const routes = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/login", element: <Login /> },
        { path: "/dashboard", element: <DashboardPage /> },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;

