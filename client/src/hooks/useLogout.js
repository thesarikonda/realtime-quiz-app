import { useState } from "react"
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import toast from "react-hot-toast";

const useLogout = () =>{
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    const logout = async () =>{
        setLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {},
                {withCredentials:true}
            )

            setAuthUser(null);
            localStorage.removeItem("user");

            toast.success("Logged out Successfully!!");
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
            
        }finally{
            setLoading(false);
        }

    }
    return {logout, loading};
}

export default useLogout;