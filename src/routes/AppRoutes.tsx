import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
// import { ProtectedRoutes } from "./ProtectedRoutes";
import { Auth } from "../pages/Auth/Auth";

export const AppRoutes = () => {
  // function Dashboard() {
  //   return <div>Dashboard</div>;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Auth />} />
        <Route path={paths.login} element={<Auth />} />
        <Route path={paths.register} element={<Auth />} />
        {/* 
        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};
