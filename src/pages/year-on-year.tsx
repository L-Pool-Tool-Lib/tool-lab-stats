// import * as React from "react";
import React from "react";
import { graphql, Link } from "gatsby";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const YearOnYearPage = ({ data }) => {
  const labels: string[] = [];
  const usage21: number[] = [];
  const usage22: number[] = [];
  const usage23: number[] = [];
  const usage24: number[] = [];
  const usage25: number[] = [];
  let weekNumber: number = 1;

  data.allPostcodeCsv.edges.forEach(
    (item: {
      node: {
        Count: number;
        StartDate_first: string;
        EndDate_first: string;
      };
    }) => {
      // labels.push(item.node.StartDate_first + " to " + item.node.EndDate_first);

      if (item.node.EndDate_first.endsWith("2021")) {
        usage21.push(item.node.Count);
        labels.push("Week " + weekNumber++);
      }
      if (item.node.EndDate_first.endsWith("2022")) {
        usage22.push(item.node.Count);
      }
      if (item.node.EndDate_first.endsWith("2023")) {
        usage23.push(item.node.Count);
      }
      if (item.node.EndDate_first.endsWith("2024")) {
        usage24.push(item.node.Count);
      }

      if (item.node.EndDate_first.endsWith("2025")) {
        usage25.push(item.node.Count);
      }
    }
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Year-on-year Tool Usage Evolution",
      },
    },
    // scales: { y: { stacked: true } },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "2021",
        data: usage21,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        // stack: "total",
      },
      {
        label: "2022",
        data: usage22,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
      },

      {
        label: "2023",
        data: usage23,
        borderColor: "rgb(255, 99, 250)",
        backgroundColor: "rgba(255, 99, 250, 0.5)",
      },

      {
        label: "2024",
        data: usage24,
        borderColor: "rgb(99, 156, 255)",
        backgroundColor: "rgba(99, 156, 255, 0.5)",
      },

      {
        label: "2025",
        data: usage25,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.5)",
      },
    ],
  };

  return (
    <>
      <Link to="/">Home</Link>
      <Line options={options} data={chartData} />;
    </>
  );
};

export const query = graphql`
  query MyQuery {
    allPostcodeCsv {
      edges {
        node {
          StartDate_first
          EndDate_first
          Count
        }
      }
    }
  }
`;

export default YearOnYearPage;

export const Head = () => <title>Superb Usage Tool</title>;
