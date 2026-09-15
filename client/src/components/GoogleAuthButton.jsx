import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "161002814315-klhvbn3n2prmaubfu2e0ch1t189psmee.apps.googleusercontent.com";

function GoogleAuthButton({ text = "signin_with", onError }) {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      try {
        const res = await API.post("/user/google", {
          credential: response.credential,
        });

        const { token, user } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate(user.role === "admin" ? "/admin" : "/");
      } catch (error) {
        const message =
          error.response?.data?.message || "Google authentication failed.";
        if (onError) {
          onError(message);
        } else {
          console.error(message);
        }
      }
    };

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 360,
          text: text, // "signin_with" | "signup_with" | "continue_with"
          shape: "rectangular",
        });
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderGoogleButton();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [navigate, onError, text]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div ref={buttonRef}></div>
    </div>
  );
}

export default GoogleAuthButton;
