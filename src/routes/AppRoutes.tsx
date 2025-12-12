import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { Layout } from "../components/Layout/Layout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Auth } from "../pages/Auth/Auth";
import { Dashboard } from "../pages/Dashboard/Dashboard";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Auth />} />
        <Route path={paths.login} element={<Auth />} />
        <Route path={paths.register} element={<Auth />} />
        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoutes>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
