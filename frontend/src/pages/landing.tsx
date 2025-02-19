import React from "react";
import {
  Container,
} from "@mui/material";
import MainSection from "../components/landing/MainSection";
import Navbar from "../components/landing/Navbar";
import Features from "../components/landing/Features";
import Register from "../components/landing/Register";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-grow flex items-center justify-center">
        <Container maxWidth="md" className="py-12">
          {/* Main Section */}
          <MainSection />

          {/* Features */}
          <Features/>

          {/* Register */}
          {/* <Register /> */}
        </Container>
      </main>
    </div>
  );
};

export default Landing;
