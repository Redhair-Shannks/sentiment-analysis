"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import Papa from "papaparse";

interface TableRowData {
  Category: "Sentiment" | "Top Liked Comment" | "Top Replied Comment" | "Word" | "Emoji";
  Type: string;
  Value: string;
  Frequency: number | "N/A";
  Hearted?: number | "N/A";
}

const ResultComponent = () => {
  const [data, setData] = useState<TableRowData[]>([]);

  useEffect(() => {
    fetch("/youtube_sentiment_analysis.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data as TableRowData[];
        setData(parsedData);
      });
  }, []);

  // Extract sentiment distribution
  const sentimentData = data.filter((row) => row.Category === "Sentiment");
  const totalSentiment = sentimentData.reduce((sum, row) => sum + (typeof row.Frequency === "number" ? row.Frequency : 0), 0);
  const pieChartData = sentimentData.map((row) => ({
    name: row.Type,
    value: totalSentiment > 0 ? ((typeof row.Frequency === "number" ? row.Frequency : 0) / totalSentiment) * 100 : 0,
  }));
  

  // Extract top liked comments
  const topLikedComments = data
    .filter((row) => row.Category === "Top Liked Comment")
    .slice(0, 5);

  // Extract top replied comments
  const topRepliedComments = data
    .filter((row) => row.Category === "Top Replied Comment")
    .slice(0, 5);

  // Extract top emojis
  const topEmojis = data
    .filter((row) => row.Category === "Emoji")
    .slice(0, 5);

  // Pie chart colors
  const COLORS = ["black", "black", "black"];

  return (
    <div className="p-4 space-y-6 text-black">
      {/* Sentiment Analysis Pie Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Liked Comments Table */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top 5 Liked Comments</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Hearted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLikedComments.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Value}</TableCell>
                  <TableCell>{row.Frequency}</TableCell>
                  <TableCell>{row.Hearted === 1 ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Replied Comments Table */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top 5 Replied Comments</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Hearted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topRepliedComments.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Value}</TableCell>
                  <TableCell>{row.Frequency}</TableCell>
                  <TableCell>{row.Hearted === 1 ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Emojis Table */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top 5 Emojis</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Emoji</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topEmojis.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Value}</TableCell>
                  <TableCell>{row.Frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultComponent;
