// import * as React from "react";
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

const UsagePage = ({ data }) => {
  let labels = [];
  let usage = [];
  let usageMale = [];
  let usageFemale = [];
  let usageRather = [];
  let usageNone = [];

  data.allGenderCsv.edges.forEach((item) => {
    usage.push(item.node.Count_sum);
    usageMale.push(item.node.male_sum);
    usageFemale.push(item.node.female_sum);
    usageRather.push(item.node.none_sum);
    usageNone.push(item.node.would_rather_not_say_sum);
    labels.push(item.node.StartDate_first + " to " + item.node.EndDate_first);
  });

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
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Usage",
        data: usage,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Usage Male",
        data: usageMale,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
      },
      {
        label: "Usage Female",
        data: usageFemale,
        borderColor: "rgb(99, 255, 213)",
        backgroundColor: "rgba(99, 255, 213, 0.5)",
      },
      {
        label: "Usage Not said",
        data: usageRather,
        borderColor: "rgb(255, 161, 99)",
        backgroundColor: "rgba(255, 161, 99, 0.5)",
      },
      {
        label: "Usage None",
        data: usageNone,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.5)",
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};

export const query = graphql`
  query MyQuery {
    allGenderCsv {
      edges {
        node {
          StartDate_first
          EndDate_first
          male_sum
          female_sum
          none_sum
          would_rather_not_say_sum
          Count_sum
        }
      }
    }
  }
`;

export default UsagePage;

export const Head = () => <title>Superb Usage Tool</title>;
