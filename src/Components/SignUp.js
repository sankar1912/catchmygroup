import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, fsdb } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { useNotifications } from "@toolpad/core";

// Styled components for layout
const SignUpSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3),
  width: "100%",
  maxWidth: 500,
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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const notification = useNotifications();

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.email;

      await setDoc(doc(fsdb, "users", userId), {
        name,
        email,
        createdAt: new Date(),
      });

      await setDoc(doc(fsdb, "friends", userId), {});
      await setDoc(doc(fsdb, "invitations", userId), {});
      await setDoc(doc(fsdb, "groupinvitations", userId), {});
      setSuccess("Account created successfully!");
      setCookies("user", userCredential.user, { path: "/" });
      notification.show("Account created successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userId = user.email;

      await setDoc(doc(fsdb, "users", userId), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
      });

      await setDoc(doc(fsdb, "friends", userId), {});
      await setDoc(doc(fsdb, "invitations", userId), {});
      await setDoc(doc(fsdb, "groupinvitations", userId), {});

      setSuccess("Google account signed in successfully!");
      setCookies("user", user, { path: "/" });
      notification.show("Google account signed in successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      setError("Google Sign-In failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterContainer>
      <SignUpSection>
        <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          CatchMyGroup - Sign Up
        </Typography>
        <Typography component="h2" variant="h6" sx={{ mb: 4, color: "#6c757d" }}>
          Create your account and start exploring.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            type="text"
            variant="outlined"
            name="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
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
          <TextField
            type="password"
            variant="outlined"
            name="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
          <Typography variant="caption" color="grey">or</Typography>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleGoogleSignUp}
          sx={{ py: 1.5, fontWeight: "bold", mt: 2 }}
        >
          Sign Up with Google
        </Button>
        <Typography variant="body2" sx={{ mt: 3, color: "#6c757d", cursor: "pointer" }}>
          Already have an account? <a href="/login">Login here</a>
        </Typography>
      </SignUpSection>
    </CenterContainer>
  );
};

export default SignUp;
