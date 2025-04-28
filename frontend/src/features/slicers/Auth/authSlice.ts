import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../../../utils/types";

interface DecodedToken {
    token_type: string;
    exp: number;
    iat: number;
    user_id: number;
    is_admin: boolean;
    email: string;
    role_group: string;
}

interface AuthState {
    access: string | null;
    refresh: string | null;
    role_group: string;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: !!localStorage.getItem('access'),
    role_group: localStorage.getItem('role_group') || "",
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
        const {is_admin, email, user_id, role_group} = decodedToken;
    
        //Store the token in the local storage
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user_id", user_id.toString());
        localStorage.setItem("role_group", role_group);
        localStorage.setItem("is_admin", is_admin ? "true" : "false");
        localStorage.setItem("email", email);

    
        return { access , refresh, role_group , email };
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
                role_group: (decodedToken as any).role_group    
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
            localStorage.removeItem('user_id');
            localStorage.removeItem('role_group');

            state.access = null;
            state.refresh = null;
            state.isAuthenticated = false;
            state.role_group = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //handle login states
            .addCase(login.fulfilled, (state, action) => {
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.role_group = action.payload.role_group;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            
            //Handle refresh states
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.access = action.payload.access;
                state.isAuthenticated = true;
                state.role_group = action.payload.role_group;
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
export const { logout } = authSlice.actions;
