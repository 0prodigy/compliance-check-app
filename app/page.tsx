"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [violations, setViolations] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const handleCheck = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setViolations("");
    setError("");
    const url = e.currentTarget.url.value;
    await fetch("/api/", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((res) => {
        setViolations(res.content);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
    setLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* create a div with input field with place holder and a submit button with minimum design using tailwind classes */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Check Compliance Violations</h1>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleCheck}
        >
          <input
            className="border bg-slate-900 border-gray-300 rounded-md w-96 h-12 px-4"
            placeholder="Enter policy page url here"
            id="url"
            type="url"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            {loading ? "Checking..." : "Check"}
          </button>
        </form>
        <div className="mt-4">
          {error && (
            <div className="text-red-500 text-sm font-bold mt-4">{error}</div>
          )}
          {violations && (
            <code className="text-sm font-bold mt-4 whitespace-pre-line">
              {violations}
            </code>
          )}
        </div>
      </div>
    </main>
  );
}
