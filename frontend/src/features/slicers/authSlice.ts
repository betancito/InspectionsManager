import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../../utils/types";

interface DecodedToken {
    token_type: string;
    exp: number;
    iat: number;
    user_id: number;
    
    is_admin: boolean;
    email: string;
}

interface AuthState {
    user: any | null;
    access: string | null;
    refresh: string | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),

    isAuthenticated: !!localStorage.getItem('access'),
    isAdmin: localStorage.getItem('is_admin') === 'true',

    error : null
};

export const login = createAsyncThunk(
    'auth/login', 
    async ({username, password}: {username:string, password:string}, {rejectWithValue}) => {

        try {
        //Make a POST request to the /token endpoint
        const response = await axios.post(
            `${API_URL}/token/`,
            {
            username,
            password,
            },
            {
            headers: {
                "Content-Type": "application/json",
            },
            }
        );
    
        //Set variables from the response
        const { access,refresh } = response.data;
    
        //Decode the access token
        const decodedToken : DecodedToken = jwtDecode(access);
        console.log("decoded token", decodedToken);
    
        //extract if logged user is admin
        const {is_admin, email} = decodedToken;
    
        //Store the token in the local storage
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("is_admin", is_admin ? "true" : "false");
        localStorage.setItem("email", email);
    
        return { access , refresh, is_admin, email };
        } catch (error) {
        console.error("Login Failed:", error);
        return rejectWithValue("Login failed");
        }
});

// Async thunk for token refresh
export const refreshToken = createAsyncThunk(
    'auth/refreshToken', 
    async(_,{getState, rejectWithValue}) => {
        const state = getState() as { auth: AuthState}
        const refreshToken = state.auth.refresh;

        if (!refreshToken) {
            return rejectWithValue('No token available to refresh')
        }

        try {
            const response = await axios.post(`${API_URL}/token/refresh/`, {
                refresh: refreshToken
            });
            const { access } = response.data;
            const decodedToken = jwtDecode(access)
            localStorage.setItem('access', access);

            return {
                access,
                isAdmin: (decodedToken as any).is_admin,    
            };
        } catch (error) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('is_admin');
            localStorage.removeItem('email');
            // Clear the state if token refresh fails
            console.error("Error refreshing token:", error);
            return rejectWithValue('Failed to refresh token');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('is_admin');
            localStorage.removeItem('email');

            state.access = null;
            state.refresh = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
        },
        setAuthUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isAdmin = action.payload.is_admin;
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isAdmin = false;
        }
    },
    extraReducers: (builder) => {
        builder
            //handle login states
            .addCase(login.fulfilled, (state, action) => {
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.isAdmin = action.payload.is_admin;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            
            //Handle refresh states
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.access = action.payload.access;
                state.isAuthenticated = true;
                state.isAdmin = action.payload.isAdmin;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                console.error("Token refresh failed:", action.payload);
                state.error = action.payload as string;
                state.access = null;
                state.refresh = null;
                state.isAuthenticated = false;
            });
    },
})

export default authSlice.reducer;
export const { logout, setAuthUser, clearAuth} = authSlice.actions;
