import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header";

// @ts-ignore
import awsExports from "./aws-exports";
import { Entry } from "./components/Entry";
import { Instructions } from "./components/Instructions";
Amplify.configure(awsExports);

function _App() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fn = async () => {
      const user = await Auth.currentUserInfo();
      const email = user.attributes.email;
      const url =
        "https://n386xcec46.execute-api.eu-central-1.amazonaws.com/dev/verify";

      // Check if email is verified
      const res = await fetch(`${url}?email=${email}`);
      const data = await res.json();

      setVerified(data.isVerified);
      setEmailSent(data.requestSent);
      setLoading(false);
    };

    fn();
  }, []);

  if (loading) {
    return (
      <div className="flex place-items-center h-full min-h-screen w-full place-content-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl font-mono">
      {!emailSent ? (
        <div className="bg-red-400 rounded-md text-center">
          Looks like this is your first time using this app. You will need to
          allow us to send emails to your account. Please check your inbox for a
          link to verify Random Journals to send emails to your account.
        </div>
      ) : (
        !verified && (
          <div className="bg-red-400 rounded-md text-center">
            We have sent you an email to allow us to send emails to your
            account. Please check your inbox. Without verifying us, we won't be
            able to send you any emails.
          </div>
        )
      )}
      <Header />
      <Toaster />
      <div className="w-full h-full flex flex-col md:flex-row gap-3 p-5 py-10 md:py-5 justify-between">
        <Entry />
        <Instructions />
      </div>
    </main>
  );
}

export const App = withAuthenticator(_App);
