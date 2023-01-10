import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Header } from "../components/Header";

export function Home() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);

  const instructions = [
    "You will receive a new random entry in your email every 24 hours.",
    "For you to receive an entry, you must have submitted your own in the past 24 hours.",
    "Emails are sent out at 12:00 PM UTC.",
    "All entries are sent anonymously and no user information is displayed in the entries.",
  ];

  function createEntry() {
    setLoading(true);
    if (entry.length > 500) {
      toast.error("Entry cannot be more than 500 characters");
      setLoading(false);
      return;
    }

    // fetch("/api/createEntry", {
    //   method: "POST",
    //   body: JSON.stringify({ entry }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.error) {
    //       alert(data.error);
    //     } else {
    //       alert("Entry created successfully");
    //       setEntry("");
    //     }
    //   });
  }

  return (
    <main className="mx-auto max-w-5xl">
      <Header />
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
            disabled={loading}
            onClick={createEntry}
            className="border border-orange-400 text-orange-400 rounded-md p-3 w-full disabled:cursor-not-allowed"
          >
            Create Entry
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
