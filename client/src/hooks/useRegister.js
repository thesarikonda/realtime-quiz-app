import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from "axios";
import { useAuthContext } from '../context/authContext';
const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const register = async ({username,email,password}) =>{
        const success = handleUserInputs({username, email, password});
        if(!success) return;

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,
                {username, email, password},
                {withCredentials:true}
            );
            const meRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/auth/me`,
                { withCredentials: true }
            );
            
        
            setAuthUser(meRes.data.user);
            


            if(data.error){
                throw new Error(data.error)
            }
            localStorage.setItem('user', JSON.stringify(meRes.data.user));

            
        } catch (error) {
            toast.error(error.message);

            
        }finally{
            setLoading(false);
        }



    }
    return {register, loading};
}

export default useRegister;

const handleUserInputs =  ({username, email, password}) => {
    if( !username || !email || !password){
        toast.error("Please fill all empties.")
        return false
    }

    if(password.length<6){
        toast.error("Password is too weak");
        return false;
    }

    return true;
}