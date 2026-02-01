import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";

const App = () => (
  <LoadingProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </LoadingProvider>
);

export default App;
