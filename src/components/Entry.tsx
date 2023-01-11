import { API, Auth, graphqlOperation } from "aws-amplify";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { CreateEntryInput } from "../API";
import { createEntry } from "../graphql/mutations";

export function Entry() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);

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
  );
}
