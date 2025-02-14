"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

const SentimentForm = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Initialize router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: youtubeLink }),
      });

      if (!response.ok) throw new Error("Processing failed");

      console.log("✅ Processing completed");

      // ✅ Redirect to results page after success
      router.push("/result");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        placeholder="Enter YouTube link"
        className="p-2 border rounded w-96"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Analyze"}
      </button>
    </form>
  );
};

export default SentimentForm;
