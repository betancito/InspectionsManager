import { useAuth0 } from "@auth0/auth0-react";

export const useApi = () => {
    const { getAccessTokenSilently, isLoading, error } = useAuth0();

    const callProtectedAPI= async(uri: string, options: RequestInit = {}) => {
        const token = await getAccessTokenSilently();
        const res = await fetch(uri, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
        });
        return res.json();
    };

    return {callProtectedAPI, isLoading, error}
}