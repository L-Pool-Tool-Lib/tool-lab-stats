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

const UsagePage = ({ data }) => {
  let labels: string[] = [];
  let usage21: number[] = [];
  let usage22: number[] = [];
  let usage23: number[] = [];
  let usage24: number[] = [];
  let usage25: number[] = [];
  let week21: number = 1;
  let week22: number = 1;
  let week23: number = 1;
  let week24: number = 1;
  let week25: number = 1;

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
        labels.push("Week " + week21++);
      }
      if (item.node.EndDate_first.endsWith("2022")) {
        usage22.push(item.node.Count);
        // labels.push("Week " + week22++);
      }
      if (item.node.EndDate_first.endsWith("2023")) {
        usage23.push(item.node.Count);
        // labels.push("Week " + week23++);
      }
      if (item.node.EndDate_first.endsWith("2024")) {
        usage24.push(item.node.Count);
        // labels.push("Week " + week24++);
      }

      if (item.node.EndDate_first.endsWith("2025")) {
        usage25.push(item.node.Count);
        // labels.push("Week " + week25++);
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
        text: "Usage Evolution",
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
        backgroundColor: "rgba(174, 255, 99, 0.5)",
      },

      {
        label: "2024",
        data: usage24,
        borderColor: "rgb(99, 156, 255)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
      },

      {
        label: "2025",
        data: usage25,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.5)",
      },

      //   {
      //     label: "Usage L18",
      //     data: usageL18,
      //     borderColor: "rgb(99, 156, 255)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L7",
      //     data: usageL7,
      //     borderColor: "rgb(172, 99, 255)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L8",
      //     data: usageL8,
      //     borderColor: "rgb(255, 161, 99)",
      //     backgroundColor: "rgba(255, 161, 99, 0.5)",
      //   },
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
          #   CA5_sum
          #   CH2_sum
          #   CH41_sum
          #   CH42_sum
          #   CH43_sum
          #   CH45_sum
          #   CH46_sum
          #   CH47_sum
          #   CH49_sum
          #   CH60_sum
          #   CH61_sum
          #   CH62_sum
          #   CH63_sum
          #   L1_sum
          #   L11_sum
          #   L12_sum
          #   L13_sum
          #   L14_sum
          #   L15_sum
          #   L16_sum
          #   L17_sum
          #   L18_sum
          #   L19_sum
          #   L2_sum
          #   L20_sum
          #   L21_sum
          #   L22_sum
          #   L23_sum
          #   L24_sum
          #   L25_sum
          #   L26_sum
          #   L28_sum
          #   L3_sum
          #   L31_sum
          #   L32_sum
          #   L33_sum
          #   L34_sum
          #   L35_sum
          #   L36_sum
          #   L37_sum
          #   L39_sum
          #   L4_sum
          #   L40_sum
          #   L5_sum
          #   L6_sum
          #   L7_sum
          #   L8_sum
          #   L9_sum
          #   LA8_sum
          #   M21_sum
          #   PR8_sum
          #   PR9_sum
          #   SO14_sum
          #   WA10_sum
          #   WA7_sum
          #   WA8_sum
          #   WA9_sum
          Count
        }
      }
    }
  }
`;

export default UsagePage;

export const Head = () => <title>Superb Usage Tool</title>;
