"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SentimentData {
  Category: string;
  Type: string;
  Value: string;
  Frequency: number;
}

const ResultComponent = () => {
  const [data, setData] = useState<SentimentData[]>([]);

  useEffect(() => {
    // Fetch the CSV file
    fetch("/youtube_sentiment_analysis.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            setData(result.data as SentimentData[]);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">YouTube Sentiment Analysis</h2>
      
      {/* 📊 Display Sentiment Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="Value" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Frequency" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* 📜 Display Raw Data */}
      <table className="w-full mt-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Category</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{row.Category}</td>
              <td className="border p-2">{row.Type}</td>
              <td className="border p-2">{row.Value}</td>
              <td className="border p-2">{row.Frequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultComponent;
