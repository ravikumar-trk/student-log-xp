import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authServices";
import { setUserLoginInfo } from "../../features/common/commonSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { getCurrentUser } from "./decodeToken";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            alert("Please enter username");
            return;
        }

        if (!password.trim()) {
            alert("Please enter password");
            return;
        }

        try {
            setLoading(true);

            const credentials = {
                Email: email,
                Password: password,
            };

            const response = await authServices.login(credentials);

            console.log("Login Response:", response);
            debugger

            if (response?.status === 200) {
                // Store JWT token
                const token = response.data?.Token;
                localStorage.setItem("token", token);
                const userData = await getCurrentUser();
                dispatch(setUserLoginInfo(userData));
                navigate("/");
            } else {
                alert(response?.data?.Message || "Invalid credentials");
            }
        } catch (error: any) {
            console.error("Login Error:", error);

            alert(
                error?.message ||
                "Something went wrong while logging in."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
            }}
        >
            {/* Left Panel */}
            <Box
                sx={{
                    flex: 1,
                    background:
                        "linear-gradient(135deg, #4361ee, #3050d0)",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                }}
            >
                <Box
                    component="img"
                    src="/images/login-illustration.png"
                    alt="Login"
                    sx={{
                        width: "75%",
                        maxWidth: 500,
                        bgcolor: "#fff",
                        p: 3,
                        borderRadius: 2,
                    }}
                />
            </Box>

            {/* Right Panel */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: 420,
                        p: 5,
                        borderRadius: 4,
                        bgcolor: "#fafafa",
                        boxShadow:
                            "0px 10px 25px rgba(0,0,0,0.08)",
                    }}
                >
                    <Box textAlign="center" mb={4}>
                        <SecurityIcon
                            sx={{
                                fontSize: 48,
                                color: "#2563eb",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                        >
                            Welcome Back
                        </Typography>

                        <Typography color="text.secondary">
                            Please sign in to your account
                        </Typography>
                    </Box>

                    {/* Username */}
                    <Typography fontWeight={600} mb={1}>
                        Username
                    </Typography>

                    <TextField
                        fullWidth
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your username"
                        margin="dense"
                        autoComplete="username"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Password */}
                    <Typography
                        fontWeight={600}
                        mt={3}
                        mb={1}
                    >
                        Password
                    </Typography>

                    <TextField
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your password"
                        margin="dense"
                        autoComplete="current-password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Login Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={handleLogin}
                        disabled={loading}
                        sx={{
                            mt: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                        }}
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </Button>

                    {/* Forgot Password */}
                    <Box textAlign="center" mt={4}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Forgot your password?{" "}
                            <Typography
                                component="span"
                                color="primary"
                                sx={{
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                Reset it
                            </Typography>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default Login;