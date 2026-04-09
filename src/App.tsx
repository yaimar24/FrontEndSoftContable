import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { TutorialProvider } from "./context/TutorialContext";

const App = () => (
  <LoadingProvider>
    <AuthProvider>
      <TutorialProvider>
        <AppRoutes />
      </TutorialProvider>
    </AuthProvider>
  </LoadingProvider>
);

export default App;
