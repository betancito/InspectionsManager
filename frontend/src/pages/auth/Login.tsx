import React, {useState} from "react";
import LoginForm from "../../components/auth/LoginForm";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../features/slicers/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../features/store";



const Login: React.FC = () => {
  //reducer functions
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated, error} = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const [authError, setError] = useState<string>("");

  //Function to handle login form submission
  const handleSubmit = async (username: string, password: string) => {
    try {
      // Dispatch the login action
      await dispatch(login({ username, password })).unwrap();

      // Redirect to dasboard page after successful login
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <LoginForm onSubmit={handleSubmit} error={authError || error || ""}/>
    </div>
  );
};

export default Login;
