import SentimentForm from "./components/sentimentForm"; // ✅ Import the form component

const Page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">YouTube Sentiment Analysis</h1>
      <SentimentForm /> {/* ✅ Use the extracted form component */}
    </div>
  );
};

export default Page;
