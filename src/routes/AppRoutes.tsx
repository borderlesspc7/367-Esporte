import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { Layout } from "../components/Layout/Layout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Auth } from "../pages/Auth/Auth";
import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Projects } from "../pages/Projects/Projects";
import { Goals } from "../pages/Goals/Goals";
import { Financial } from "../pages/Financeiro/Financial";
import { Reports } from "../pages/Reports/Reports";
import { Profile } from "../pages/Profile/Profile";
import { Settings } from "../pages/Settings";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Auth />} />
        <Route path={paths.login} element={<Auth />} />
        <Route path={paths.register} element={<Auth />} />
        <Route path={paths.forgotPassword} element={<ForgotPassword />} />
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
        <Route
          path={paths.projects}
          element={
            <ProtectedRoutes>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.goals}
          element={
            <ProtectedRoutes>
              <Layout>
                <Goals />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.financial}
          element={
            <ProtectedRoutes> 
              <Layout>
                <Financial />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.reports}
          element={
            <ProtectedRoutes>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.profile}
          element={
            <ProtectedRoutes>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.settings}
          element={
            <ProtectedRoutes>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
