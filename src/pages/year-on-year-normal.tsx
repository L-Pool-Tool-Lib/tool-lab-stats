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
  Legend,
);

const YearOnYearNormalPage = ({ data }) => {
  const labels: string[] = [];
  const usage21: number[] = [];
  const usage22: number[] = [];
  const usage23: number[] = [];
  const usage24: number[] = [];
  const usage25: number[] = [];
  let weekNumber: number = 0;

  data.allGenderCsv.edges.forEach(
    (item: {
      node: {
        Count_sum: number;
        StartDate_first: string;
        EndDate_first: string;
      };
    }) => {
      // labels.push(item.node.StartDate_first + " to " + item.node.EndDate_first);

      if (item.node.EndDate_first.endsWith("2021")) {
        usage21.push(item.node.Count_sum - (usage21[1] ? usage21[1] : 0));
      }
      if (item.node.EndDate_first.endsWith("2022")) {
        labels.push("Week " + ++weekNumber);
        usage22.push(item.node.Count_sum - (usage22[1] ? usage22[1] : 0));
      }
      if (item.node.EndDate_first.endsWith("2023")) {
        usage23.push(item.node.Count_sum - (usage23[1] ? usage23[1] : 0));
      }
      if (item.node.EndDate_first.endsWith("2024")) {
        usage24.push(item.node.Count_sum - (usage24[1] ? usage24[1] : 0));
      }

      if (item.node.EndDate_first.endsWith("2025")) {
        usage25.push(item.node.Count_sum - (usage25[1] ? usage25[1] : 0));
      }
    },
  );

  const options = {
    responsive: true,
    // elements: {
    //   line: {
    //     tension: 0.4,
    //   },
    // },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Normalised Year-on-year Tool Usage Evolution",
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
        borderColor: "rgb(0, 63, 92)",
        backgroundColor: "rgba(0, 63, 92, 0.8)",
        // borderColor: "rgb(151, 208, 251)",
        // backgroundColor: "rgba(151, 208, 251, 0.8)",
        // stack: "total",
      },
      {
        label: "2022",
        data: usage22,
        borderColor: "rgb(88, 80, 141)",
        backgroundColor: "rgba(88, 80, 141, 0.8)",
        // borderColor: "rgb(117, 173, 214)",
        // backgroundColor: "rgba(117, 173, 214, 0.8)",
      },

      {
        label: "2023",
        data: usage23,
        borderColor: "rgb(255, 99, 97)",
        backgroundColor: "rgba(255, 99, 97, 0.8)",
        // borderColor: "rgb(83, 139, 177)",
        // backgroundColor: "rgba(83, 139, 177, 0.8)",
      },

      {
        label: "2024",
        data: usage24,
        borderColor: "rgb(255, 166, 0)",
        backgroundColor: "rgba(255, 166, 0, 0.8)",
        // borderColor: "rgb(48, 107, 142)",
        // backgroundColor: "rgba(48, 107, 142, 0.8)",
      },

      {
        label: "2025",
        data: usage25,
        borderColor: "rgb(188, 80, 144)",
        backgroundColor: "rgba(188, 80, 144, 0.8)",
        // borderColor: "rgb(0, 70, 100)",
        // backgroundColor: "rgba(0, 70, 100, 0.8)",
      },
    ],
  };

  return (
    <>
      <Link to="/">Home</Link>
      <Line options={options} data={chartData} />
    </>
  );
};

export const query = graphql`
  query MyQuery {
    allGenderCsv {
      edges {
        node {
          StartDate_first
          EndDate_first
          Count_sum
        }
      }
    }
  }
`;

export default YearOnYearNormalPage;

export const Head = () => <title>Superb Usage Tool</title>;
