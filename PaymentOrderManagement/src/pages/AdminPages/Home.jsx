import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const styles = {
    body: {
      margin: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0f0f0f, #292929)",
      fontFamily: "'Poppins', sans-serif",
      color: "white",
      overflow: "hidden",
      textAlign: "center",
      position: "relative",
    },
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    h1: {
      fontSize: "6rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "6px",
      position: "relative",
      animation: "float 3s ease-in-out infinite",
      textShadow: "4px 4px 20px rgba(255, 255, 255, 0.3)",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: "300",
      letterSpacing: "3px",
      position: "relative",
      textShadow: "2px 2px 15px rgba(255, 255, 255, 0.2)",
    },
    glow: {
      animation: "glow 2s infinite alternate",
    },
    signInButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "8px 16px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px", // Increased from 5px to 8px for more rounding
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1rem",
      transition: "background-color 0.3s",
      ":hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    },
    signInIcon: {
      width: "20px",
      height: "20px",
      marginLeft: "8px",
    },
    keyframes: `
      @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      @keyframes glow {
        0% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
        100% { text-shadow: 0 0 25px rgba(255, 255, 255, 0.9); }
      }
    `,
  };


  const handleSignInClick = () => {
    navigate("/login"); // Navigate to the /login route
  };


  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.body}>
        <div style={styles.container}>
          <h1 style={{ ...styles.h1, ...styles.glow }}>Life Fashion</h1>
          <h2 style={styles.h2}>Clothing Store</h2>
        </div>
        <button style={styles.signInButton}
          onClick={handleSignInClick}
        >
          Sign In
          <svg
            style={styles.signInIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Home;