import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/authContext";

const useLogin =  () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext()


    const login = async({email, password})=>{
        const success = handleUserInputs(email, password);
        if(!success) return;
        setLoading(true);
        

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
                {email, password},
                {withCredentials : true}
            )

            const meRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`,
                {withCredentials:true}
            )
            setAuthUser(meRes.data);
            

            toast.success("Logged in successfully!!")


            
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            
        }finally{
            setLoading(false)
        }

    }
    return {login , loading};

}

function handleUserInputs(username, password){
    if(!username || !password){
        toast.error("Please fill all the empties");
        return false;
    }

    return true;
}

export default useLogin;
