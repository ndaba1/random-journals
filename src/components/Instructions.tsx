export function Instructions() {
  const instructions = [
    "You will receive a new random entry in your email every 24 hours.",
    "For you to receive an entry, you must have submitted your own in the past 24 hours.",
    "Emails are sent out at 12:00 PM UTC.",
    "All entries are sent anonymously and no user information is displayed in the entries.",
  ];

  return (
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
  );
}
