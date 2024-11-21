import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { isAuthenticatedState, userRoleState } from './store/AuthState';

import Dashboard from './components/dashboard/Dashboard';
import Admin from './components/admins/Admin';
import Banner from './components/banners/Banner';
import User from './components/users/User';
// import Activity from './components/activity/Activity';
// import BotActivity from './components/botsactivity/BotActivity';
import Login from './components/login/Login';
import Support from './components/support/Support';
import Notifications from './components/notifications/Notifications';
import Games from './components/games/Games';
// import ForgotPassword from './components/login/ForgotPassword';

const ProtectedRoute: React.FC<{ 
  element: React.ReactElement, 
  allowedRoles?: string[] 
}> = ({ element, allowedRoles }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const userRole = useRecoilValue(userRoleState);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function AppRoutes() {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login />: <Navigate to = "/" />} />
      {/* <Route path="/reset-password" element={!isAuthenticated ? <ForgotPassword />: <Navigate to = "/" />} /> */}
      <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/admins" element={<ProtectedRoute element={<Admin />} allowedRoles={['admin', 'superadmin']} />} />
      <Route path="/banners" element={<ProtectedRoute element={<Banner />} />} />
      <Route path="/users" element={<ProtectedRoute element={<User />} allowedRoles={['admin', 'superadmin']} />} />
      {/* <Route path="/activity" element={<ProtectedRoute element={<Activity />} />} />
      <Route path="/bots-activity" element={<ProtectedRoute element={<BotActivity />} />} /> */}
      <Route path="/support" element={<ProtectedRoute element={<Support/>} />} />
      <Route path="/notifications" element={<ProtectedRoute element={<Notifications/>} />} />
      <Route path="/games" element={<ProtectedRoute element={<Games/>} />} />
    </Routes>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppRoutes />
      </Router>
    </RecoilRoot>
  );
}

export default App;