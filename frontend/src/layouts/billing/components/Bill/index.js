import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Alert from '@mui/material/Alert';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Header from "layouts/profile/components/Header1";
import { getUserRole } from "utils/authUtils";

function Add_Role() {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const userRole = getUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Check user role and redirect if not admin
    if (userRole !== "admin") {
      navigate("/dashboard"); // Redirect to dashboard if not admin
    }
  }, [userRole, navigate]);

  const handleChangeRole = async () => {
    if (!email || !newRole) {
      setSuccess(false);
      setMessage("Both fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is not available");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post("http://localhost:3003/change-role", {
        email: email, // Ajoutez l'email de l'utilisateur
        newRole: newRole // Ajoutez le nouveau rôle
      }, config);

      console.log("Role changed successfully", response.data);
      setSuccess(true);
      setMessage("Role changed successfully");
    } catch (error) {
      console.error("Error changing role");
      setSuccess(false);
      setMessage("Email does not exist " );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={1} />
      <Header>
        <MDBox mt={-5} mb={-2} style={{ color: "rgb(242, 242, 242)" }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: "white" }} style={{ height: "90%", width: "150%" }}>
                <CardContent>
                  {message && <Alert severity={success ? "success" : "error"}>{message}</Alert>}
                  <FormControl fullWidth>
                    <TextField
                      id="email"
                      label="User Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ marginTop: "20px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      id="newRole"
                      label="New Role"
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      required
                      style={{ marginTop: "30px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminPanelSettingsIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{
                      color: "rgb(7, 198, 163)",
                      backgroundColor: "black",
                      marginTop: "40px",
                      marginBottom: "20px",
                    }}
                    onClick={handleChangeRole}
                  >
                    Change Role
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Add_Role;
