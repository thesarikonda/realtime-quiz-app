import { createContext,useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const API_URL = import.meta.env.VITE_API_URL;

    // fetch user on app load;
    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/me`,{
                withCredentials:true
            });
            setAuthUser(res.data);
            
        } catch (error) {
            setAuthUser(null)
            
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchUser();
    }, []);
    
    const value = {
        authUser,
        setAuthUser,
        loading,
        isAuthenticated : !!authUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("User Auth Context must be with AuthProvider")
    }
    return context;
}