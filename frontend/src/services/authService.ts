import axios from "axios";
import { jwtDecode } from "jwt-decode";

//interface for decoded JWT
interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  user_id: number;
  is_admin: boolean;
  email: string;
}

//Import the API_URL from the .env file
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username: string, password: string) => {
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
    console.error("AuthServic login failed", error);
    throw error;
  }
};
