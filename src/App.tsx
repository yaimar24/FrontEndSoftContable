import AppRoutes from "@/presentation/routes/Routes";
import { AuthProvider } from "@/application/context/AuthContext";
import { LoadingProvider } from "@/application/context/LoadingContext";
import { TutorialProvider } from "@/application/context/TutorialContext";
import { PerfilProvider } from "@/application/context/PerfilContext";

const App = () => (
  <LoadingProvider>
    <AuthProvider>
      <PerfilProvider>
        <TutorialProvider>
          <AppRoutes />
        </TutorialProvider>
      </PerfilProvider>
    </AuthProvider>
  </LoadingProvider>
);

export default App;
