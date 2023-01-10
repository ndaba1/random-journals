import { Auth } from "aws-amplify";

export function Header() {
  async function signOut() {
    await Auth.signOut();
  }

  return (
    <header className="w-full h-20 bg-gray-800 flex items-center justify-between px-4 sticky top-0">
      <div className="flex items-center gap-4">
        {/* <img src={logoSvg} alt="Logo" className="w-10 h-10" /> */}
        <h1 className="text-2xl font-bold neonText">Random Journals</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-gray-700  px-4 py-2 rounded-md" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
