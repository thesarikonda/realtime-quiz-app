import {useState, useContext,createContext, useEffect} from 'react'
import {io} from 'socket.io-client';


const SocketContext = createContext(null);
export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io(import.meta.env.VITE_API_URL,{
            withCredentials:true,
            reconnection:true
        });
        setSocket(s);
        return () => {
            
        };

    },[]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);
