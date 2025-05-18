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
  CoreChartOptions,
  ElementChartOptions,
  DatasetChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { _DeepPartialObject } from "chart.js/dist/types/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function makeStackable(
  stackStatus: string,
  chartData: {
    labels: string[];
    datasets: (
      | {
          label: string;
          data: number[];
          borderColor: string;
          backgroundColor: string;
          stack: string | undefined;
        }
      | {
          label: string;
          data: number[];
          borderColor: string;
          backgroundColor: string;
          stack?: undefined;
        }
    )[];
  }
) {
  // const chartData = {
  // labels,
  // datasets: [
  //   {
  //     label: "Total Usage",
  //     data: usage,
  //     borderColor: "rgb(255, 99, 132)",
  //     backgroundColor: "rgba(255, 99, 132, 0.5)",
  //     // stack: "total",
  //   },

  // const stackableDataset
  // for (let dataset: {} of chartData.datasets) {
  const datasets = chartData.datasets.map((dataset) => {
    if (dataset.label !== "Total" && stackStatus === "unstack") {
      {
        dataset.stack = stackStatus;
      }
    } else {
      dataset.stack = undefined;
    }
    return dataset;
  });

  return {
    labels: chartData.labels,
    datasets: datasets,
  };
}

const StackableLine = ({ chartData, chartOptions }) => {
  //   let stackable: any;
  const [stacking, setStacking] = React.useState("stack");
  // const [stacking, setStacking] = React.useState("stacked");

  const toggleStacking = () => {
    if (stacking === "stack") {
      // stack(chartOptions);
      setStacking("unstack");
    } else {
      setStacking("stack");
    }
  };

  chartData = makeStackable(stacking, chartData);

  return (
    <>
      <Link to="/">Home</Link>
      <button onClick={() => toggleStacking()}>{stacking}</button>

      <Line options={chartOptions} data={chartData} />
    </>
  );
};

export default StackableLine;
