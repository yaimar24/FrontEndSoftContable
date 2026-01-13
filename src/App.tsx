import AppRoutes from './routes/Routes';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
