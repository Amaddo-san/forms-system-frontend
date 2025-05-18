import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirector: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);

      if (user.occupation === "STUDENT") {
        navigate("/home");
      } else if (user.occupation !== "STUDENT") {
        navigate("/doctor-home");
      } else {
        // fallback if role is unexpected
        navigate("/login");
      }
    } catch (error) {
      console.error("Redirection failed:", error);
      navigate("/login");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default HomeRedirector;
