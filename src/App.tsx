import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API, Auth, graphqlOperation } from "aws-amplify";
import { SES } from "aws-sdk";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { CreateEntryInput } from "./API";
import { Header } from "./components/Header";
import { createEntry } from "./graphql/mutations";

const ses = new SES({
  region: "eu-central-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// @ts-ignore
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function _App() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    const fn = async () => {
      const user = await Auth.currentUserInfo();
      const email = user.attributes.email;

      // Hack to allow SES to send emails in Sandbox mode
      ses.listIdentities((err, data) => {
        if (err) {
          console.log(err);
        } else {
          const verified = data.Identities.map((i) => i);
          console.log(verified);
          if (!verified.includes(email)) {
            setVerified(false);
            ses
              .verifyEmailIdentity({ EmailAddress: email })
              .promise()
              .catch((e) => console.log(e));
          }
        }
      });
    };

    fn();
  }, []);

  const instructions = [
    "You will receive a new random entry in your email every 24 hours.",
    "For you to receive an entry, you must have submitted your own in the past 24 hours.",
    "Emails are sent out at 12:00 PM UTC.",
    "All entries are sent anonymously and no user information is displayed in the entries.",
  ];

  function addEntry() {
    setLoading(true);

    // create entry mutation
    const fn = async () => {
      const user = await Auth.currentUserInfo();
      const email = user.attributes.email;

      await API.graphql(
        graphqlOperation(createEntry, {
          input: {
            content: entry,
            createdAt: new Date().toISOString(),
            author: email,
          } as CreateEntryInput,
        })
      );

      setEntry("");
      setLoading(false);
    };

    // create entry mutation
    toast.promise<void>(fn(), {
      loading: "Submitting entry...",
      success: "Entry created successfully!",
      error: (e) => {
        console.log(e);
        return `Error submitting entry${e}`;
      },
    });
  }

  return (
    <main className="mx-auto max-w-5xl font-mono">
      {!verified && (
        <div className="bg-red-400 rounded-md mt-1  text-white p-3 text-center">
          Looks like this is your first time using this app. You will need to
          allow us to send emails to your account. Please check your inbox for a
          link to verify Random Journals to send emails to your account.
        </div>
      )}
      <Header />
      <Toaster />
      <div className="w-full h-full flex flex-col md:flex-row gap-3 p-5 py-10 md:py-5 justify-between">
        {/* feed section */}
        <section className="flex flex-col pt-8 gap-5 place-items-center place-content-center flex-[4]">
          <p className="text-xl font-bold self-start">Create a new entry: </p>
          <textarea
            name="entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full h-80 p-5 font-bold resize-none bg-transparent border-2 border-gray-400 rounded-md outline-none"
          />
          <p
            className={clsx(
              "text-xs self-end",
              entry.length > 500 ? "text-red-400" : "text-green-400"
            )}
          >
            {entry.length} / 500 characters (max){" "}
          </p>
          <button
            disabled={loading || entry.length > 500 || !entry.length}
            onClick={addEntry}
            className="bg-orange-400 rounded-md p-3 font-bold text-lg w-full disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </section>
        <aside className="flex-[3] text-gray-300 p-8">
          {/* instructions */}
          <p className="text-xl font-bold mb-5">How it works: </p>
          <ul className="list-disc pl-5">
            {instructions.map((instruction) => (
              <li key={instruction} className="mb-4">
                {instruction}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}

export const App = withAuthenticator(_App);
