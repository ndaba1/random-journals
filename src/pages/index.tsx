import { sendSignInLinkToEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import thoughtSvg from "../assets/thoughts.svg";
import { auth } from "../config/firebase";

export function Home() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log(import.meta.env.VITE_APP_URL);
    if (email && !validateEmail(email)) {
      setErrors(["Please enter a valid email address."]);
    } else {
      setErrors([]);
    }
  }, [email]);

  const validateEmail = (email: string) => {
    const re =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${import.meta.env.VITE_APP_URL}/feed`,
      });
      alert("Login link sent to your email.");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-full min-h-screen bg-gray-800 text-white p-8 md:p-16 items-center">
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
        <p className="text-xl font-light">
          Welcome to Random Journals! This is a safe space where you can share
          your thoughts anonymously with other people from all around the world
          as well as read journal entries from other users. Whether you want to
          rant about something that happened to you today or just want to share
          a funny story, this is the place for you! Get started or login to your
          account by providing your email address.
        </p>
      </div>
      <div className="flex items-center justify-center">
        {/* Passwordless email login form */}
        <form
          className="bg-white w-full md:w-[80%] h-full text-gray-800 rounded-md p-8 md:p-12 overflow-hidden"
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
            className="w-full border-2 border-gray-400 rounded-md p-3 mb-5"
            placeholder="example@gmail.com"
          />

          {errors.length > 0 && (
            <ul className="text-red-500 mb-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className="w-full mb-5 bg-orange-400 text-white rounded-md p-3 disabled:cursor-not-allowed"
            disabled={!email || errors.length > 0}
          >
            Sign In
          </button>

          <p className="text-sm text-gray-800 font-bold">
            A login link will be sent to the email address that you provide.
            Your email address is only used to create your account and will not
            be shared with anyone.
          </p>
        </form>
      </div>
    </main>
  );
}
