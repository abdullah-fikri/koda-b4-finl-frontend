import { AuthContextLayout } from "./context/AuthContextLayout";
import Dashboard from "./pages/Dashboard";
import Links from "./pages/LinkPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Setting from "./pages/Setting";
import LandingPage from "./pages/landingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/links",
    element: <Links />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
]);

const App = () => {
  return (
    <AuthContextLayout>
      <RouterProvider router={router} />
    </AuthContextLayout>
  );
};

export default App;
