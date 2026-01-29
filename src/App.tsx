import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastContainer } from "./components/ui/Toast/ToastContainer";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
