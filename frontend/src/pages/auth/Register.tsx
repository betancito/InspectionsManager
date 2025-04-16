import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/registerForm";
import React from "react";
const Register:React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <RegisterForm/>
    </div>
  );
};

export default Register;
