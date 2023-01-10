// This page will be called from firebase login link sent to user email

import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";

// It validates the current url then signs in the user
export function CompleteSignIn() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Sign in the user
    useEffect(() => {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      if (!user && loading) {
        toast.promise<User>(
          new Promise((resolve, reject) => {
            signInWithEmailLink(auth, email!, window.location.href)
              .then(({ user }) => {
                resolve(user);
                setUser(user);
                setLoading(false);
                window.localStorage.removeItem("emailForSignIn");
              })
              .catch((error) => {
                reject(error);
                setLoading(false);
                setError((error.message as string).replace("Firebase: ", ""));
                console.log(error);
              });
          }),
          {
            loading: "Signing in...",
            success: "Signed in successfully",
            error: (e) => `${e.message.replace("Firebase: ", "")}`,
          }
        );
      }
    }, []);
  }

  if (!loading && user) {
    return <Navigate to="/feed" />;
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-screen flex place-items-center place-content-center">
        <p>{error || "An error occurred, please try again later"}</p>
      </div>
    );
  }

  if (!(isSignInWithEmailLink(auth, window.location.href) || user) && loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-full min-h-screen flex place-items-center place-content-center">
      <p>Please wait...</p>
    </div>
  );
}
