import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper } from "@mui/material";
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { useNotifications } from "@toolpad/core";

// Styled components for the layout
const LoginSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3),
  width: "100%",
  maxWidth: 400,
  textAlign: "center",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const CenterContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const Login = ({ setNewUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const notification = useNotifications();
  const [cookies, setCookies, removeCookies] = useCookies(['user']);

  const handleSignIn = async () => {
    signOut(auth);
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      notification.show('Login Success', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      setCookies('user', userCredential.user, { path: '/' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      notification.show('Google Sign-In Success', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      setCookies('user', user, { path: '/' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterContainer>
      <LoginSection>
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          CatchMyGroup
        </Typography>
        <Typography
          component="h2"
          variant="h6"
          sx={{ mb: 4, color: "#6c757d" }}
        >
          Welcome Back! Please sign in to continue.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            type="email"
            variant="outlined"
            name="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="password"
            variant="outlined"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
        <Typography variant="caption" color="grey">or</Typography>
                
        {/* Google Sign-in Button */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleGoogleSignIn}
          sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In with Google"}
        </Button>
         
        <Typography
          variant="body2"
          sx={{ mt: 3, color: "#6c757d", cursor: "pointer" }}
        >
          New User? <span onClick={() => { setNewUser(true); }}>Click here....</span>
        </Typography>
      </LoginSection>
    </CenterContainer>
  );
};

export default Login;
