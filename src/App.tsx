import AppRoutes from "@/presentation/routes/Routes";
import { AuthProvider } from "@/application/context/AuthContext";
import { LoadingProvider } from "@/application/context/LoadingContext";
import { TutorialProvider } from "@/application/context/TutorialContext";

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
