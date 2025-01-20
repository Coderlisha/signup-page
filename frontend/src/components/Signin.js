import React, { useState } from "react";
import axios from "axios";
import { useFetcher, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://signup-page-2q5d.vercel.app/api/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          // mode: "no-cors",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        return;
      }

      const successMessage = await response.text();
      alert(successMessage);
      navigate("/home");
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Failed to sign in. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Welcome Back!</h1>
        <p style={styles.subtitle}>Sign in to access your account</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a href="/signup" style={styles.link}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `url("https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg")`, // Replace with your preferred gradient background
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  formWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "26px",
    color: "#333",
    marginBottom: "10px",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputFocus: {
    borderColor: "#007BFF",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  footerText: {
    fontSize: "14px",
    color: "#555",
    marginTop: "20px",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default SignIn;
