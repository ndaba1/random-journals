import { sendSignInLinkToEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import thoughtSvg from "../assets/thoughts.svg";
import { auth } from "../config/firebase";

export function Index() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, usrLoading, usrError] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }

    if (usrError) {
      setError(usrError.message);
      setLoading(false);
    }

    if (usrLoading) {
      setLoading(true);
    } else if (user) {
      navigate("/feed");
    } else {
      setLoading(false);
    }
  }, [email, user, usrError, usrLoading]);

  const validateEmail = (email: string) => {
    const re =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    toast.promise<void>(
      new Promise((resolve, reject) => {
        sendSignInLinkToEmail(auth, email, {
          url: `${import.meta.env.VITE_APP_URL}/complete`,
          handleCodeInApp: true,
        })
          .then(() => {
            resolve();
            setLoading(false);
            window.localStorage.setItem("emailForSignIn", email);
          })
          .catch((e) => {
            reject(e);
            setLoading(false);
            console.log(e);
          });
      }),
      {
        loading: "Sending login link...",
        success: "Login link sent to your email.",
        error: (e) => `${e.message.replace("Firebase: ", "")}`,
      },
      {
        style: {
          minWidth: "300px",
        },
        duration: 8000,
      }
    );
  };

  if (!loading && user) {
    return <Navigate to="/feed" />;
  }

  if (!loading) {
    return (
      <main className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-full min-h-screen p-8 md:p-16 items-center">
        <div>
          <div className="flex items-center justify-center">
            <img
              src={thoughtSvg}
              alt="Thoughts"
              className="w-[80%] md:w-[30%] my-5"
            />
          </div>
          <div className="mx-auto text-center">
            <h1 className="text-3xl inline-block font-bold my-6 neonText">
              Random Journals
            </h1>
          </div>
          <p className="text-lg font-light">
            Welcome to Random Journals! This is a safe space for anonymously
            sharing your thoughts with other users and read their entries as
            well. Whether you want to rant about something that happened to you
            today or just want to share a funny story, this is the place for
            you! Get started or login to your account by providing your email
            address.
          </p>
        </div>
        <div className="flex items-center justify-center">
          {/* Passwordless email login form */}
          <form
            className="bg-white w-full md:w-[75%] h-full text-gray-800 rounded-md p-8 md:p-12 overflow-hidden"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              Login / Get Started
            </h2>

            <label htmlFor="email" className="block mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-400 rounded-md p-3 mb-5 "
              placeholder="example@gmail.com"
            />

            {error && <p className="text-red-500 text-sm mb-5">{error}</p>}

            <button
              type="submit"
              className="w-full mb-5 bg-orange-400 text-white rounded-md p-3 disabled:cursor-not-allowed"
              disabled={!email || error.length > 0 || loading}
            >
              Sign In
            </button>

            <p className="text-sm text-gray-800 font-bold">
              A login link will be sent to the email address that you provide.
              Be sure to check your spam folder if you do not receive the email
              before trying again.
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full h-full min-h-screen flex place-items-center place-content-center">
      <p>Please wait...</p>
    </div>
  );
}
