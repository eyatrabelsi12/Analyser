import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/neoxam.jpg";
import './style.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const lockoutDuration = 2 * 60 * 60 * 1000; // 2 heures
    if (attemptCount >= 3) {
      setIsAccountLocked(true);
      setTimeout(() => {
        setIsAccountLocked(false);
        setAttemptCount(0);
      }, lockoutDuration);
    }
  }, [attemptCount]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isAccountLocked) {
        alert("Your account is temporarily locked. Please try again later.");
        return;
    }

    const url = "http://localhost:3003/login"; // Change this to your server URL
    const data = { email, password };

    try {
        const response = await axios.post(url, data);
        console.log(response.data);
        setLoginSuccess(true);

        // Store the token and user role in local storage after a successful login
        const { token, role } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);  // Store user role
    } catch (error) {
        setAttemptCount(attemptCount + 1);
        let errorMessage = "";
        if (error.response) {
            console.error("Erreur de réponse du serveur:", error.response.data);
            errorMessage = `Error: ${error.response.data.message}`;
        } else if (error.request) {
            console.error("Aucune réponse du serveur reçue.");
            errorMessage = "Error: The server did not respond. Please try again later.";
        } else {
            console.error("Erreur lors de la configuration de la requête:", error.message);
            errorMessage = "Error: An error occurred while setting up the request. Please check your connection and try again.";
        }
        alertWithBlackBackground(errorMessage);
    }
};



  const alertWithBlackBackground = (message) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alert");
    alertContainer.textContent = message;
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.width = '20%';
    okButton.style.backgroundColor = 'black';
    okButton.style.color = 'white';
    okButton.style.fontFamily = 'italic';
    okButton.style.borderColor = '#1de9b6';
    okButton.style.marginLeft = '75%';
    okButton.addEventListener("click", () => {
      document.body.removeChild(alertContainer);
      if (loginSuccess) {
        navigate("/dashboard");
      }
    });
    alertContainer.appendChild(okButton);
    document.body.appendChild(alertContainer);
  };
  

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="success"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-5}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
           DATAHUB ANALYSER AND KPI
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAccountLocked}
                style={{ borderColor: isAccountLocked ? 'grey' : 'black' }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAccountLocked}
                style={{ borderColor: isAccountLocked ? 'grey' : 'black' }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="success" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don't have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="success"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography><br></br>
             
                <MDTypography
                  component={Link}
                  to="/authentication/forgot"
                  variant="button"
                  color="success"
                  fontWeight="medium"
                  textGradient
                >
                 Forgot Your Password
                </MDTypography><br></br>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {loginSuccess && (
        <div style={{position: 'fixed', top: '11%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(0, 0, 0)',  borderRadius: '5px', zIndex: '9999', fontFamily:' italic'}}>
          Success! Logged in successfully.
          <button onClick={() => navigate("/dashboard")} style={{width:'20%',backgroundColor:'black',color:"white",fontFamily:'italic',borderColor:'#1de9b6',marginLeft:'75%'}}>OK</button>
        </div>
      )}
    </CoverLayout>
  );
};

export default Login;