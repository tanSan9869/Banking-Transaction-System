import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

const PrivateRoute = ({children}) =>{
  const {user,loading} = useAuth();
  if(loading) return <div className="loader"></div>
  return user ? children : <Navigate to="/login"/>
}

const AppRoutes = () => {
  return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={
      <PrivateRoute><Dashboard /></PrivateRoute>
    } />
    <Route path="*" element={<Navigate to="/login" />}/>
  </Routes>
  );
};
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
