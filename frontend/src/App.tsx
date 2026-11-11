import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ForbiddenPage } from './pages/ForbiddenPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ManageStallsPage } from './pages/ManageStallsPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { StallDetailPage } from './pages/StallDetailPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="stalls/:id" element={<StallDetailPage />} />
            <Route path="forbidden" element={<ForbiddenPage />} />

            <Route element={<ProtectedRoute roles={['owner', 'admin']} />}>
              <Route path="manage" element={<ManageStallsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
