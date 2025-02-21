import React, {createContext, useState, useContext, useEffect} from "react";
import { login } from "../services/authService";

//Interface including types of data provided by the context
interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
}

//Context declaration
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Function to get auth state from local storage
const getAuthState = () => {
    //Initial function to get auth state from local storage
    const access = localStorage.getItem("access");
    const isAdmin = localStorage.getItem("is_admin");

    if (!access) {
        return {
            isAuthenticated: false,
            isAdmin,
        };
    } else {
        return {
            isAuthenticated: true,
            isAdmin: false,
        };
    };
    console.log("AuthContext getAuthState", access, isAdmin);
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    //read local storage to set state
    useEffect(() => {
        const { isAuthenticated, isAdmin } = getAuthState();
        setIsAuthenticated(isAuthenticated);
        setIsAdmin(isAdmin === "true");
    }, []);

    //Login func for login form
    const loginUser = async (username: string, password: string) => {
        try {
            const data = await login(username, password);

            //get decoded data
            setIsAuthenticated(true);
            setIsAdmin(data.is_admin);
        } catch (error) {
            console.error("Authcontext login failed", error);
            throw error;
        }
};

    //Logout function (clears tokens in local storage)
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("is_admin");
        localStorage.removeItem("email");
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, isAdmin, loginUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

// Custom AuthContext WebHook
 export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    };
    return context;
};