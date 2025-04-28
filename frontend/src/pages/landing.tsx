import React from "react";
import {
  Container,
} from "@mui/material";
import MainSection from "../components/landing/MainSection";
import Navbar from "../components/landing/Navbar";
import Features from "../components/landing/Features";
import { useAuth0 } from "@auth0/auth0-react";

const Landing: React.FC = () => {
  const {user, isAuthenticated, token} = useAuth0();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-grow flex items-center justify-center">
        <Container maxWidth="md" className="py-12">
          {/* If authenticated show user data returned by auth0 */}
          {isAuthenticated && (
            <div>
              <article className="column">
                {JSON.stringify(user)}
              </article>
            </div>
          )}

          {/* Main Section */}
          <MainSection />

          {/* Features */}
          <Features/>
        </Container>
      </main>
    </div>
  );
};

export default Landing;
