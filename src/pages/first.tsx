import React from "react";
import { graphql } from "gatsby";
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

const FirstsPage = ({ data }) => {
  let labels = [];
  let firsts = [];
  let allUsers = [];

  data.allFirstCsv.edges.forEach((item) => {
    allUsers.push(item.node.all_users);
    firsts.push(item.node.New_Users);
    labels.push(item.node.Start_Date + " to " + item.node.End_Date);
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "New Users",
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "First Time Users",
        data: firsts,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "All Users",
        data: allUsers,
        borderColor: "rgb(255, 161, 99)",
        backgroundColor: "rgba(255, 161, 99, 0.5)",
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};

export const query = graphql`
  query MyQuery {
    allFirstCsv {
      edges {
        node {
          Start_Date
          End_Date
          New_Users
          all_users
        }
      }
    }
  }
`;

export default FirstsPage;

export const Head = () => <title>Superb Usage Tool</title>;
