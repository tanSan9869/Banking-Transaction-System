import {  createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

    
    const login = async (email,password) =>{
        const res = await api.post('/auth/login',{email,password});
        localStorage.setItem('token',res.data.token);
        localStorage.setItem('user', JSON.stringify({
            email:res.data.email,
            fullName:res.data.fullName
        }));
        setUser({email:res.data.email,fullName:res.data.fullName});
        navigate('/dashboard');
    };

    const register = async (fullName,email,password) => {
        const res = await api.post('/auth/register',{fullName,email,password});
        localStorage.setItem('token',res.data.token);
        localStorage.setItem('user',JSON.stringify({
            email:res.data.email,
            fullName:res.data.fullName
        }));
        setUser({email:res.data.email,fullName:res.data.fullName});
        navigate('/dashboard');
    };

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return(
        <AuthContext.Provider value={{user,loading,login,register,logout}}>
            {children}
        </AuthContext.Provider>
    );
    };

export default AuthContext;