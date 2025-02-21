import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [error, setError] = useState<string>('');

  //Function to handle login form submission
  const handleSubmit = async (username: string, password: string) => {
    try {
      await loginUser(username, password);
      navigate("/dashboard");
      setError(''); //Redirect to dashboard after authenticated
    } catch (error) {
      console.error("Login failed", error);
      setError('Algo ha salido mal, por favor revise sus credenciales e intente de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <LoginForm onSubmit={handleSubmit} error={error}/>
    </div>
  );
};

export default Login;
