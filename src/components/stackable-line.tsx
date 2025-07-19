// import * as React from "react";
import React from "react";
import { Link } from "gatsby";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const datasets = chartData.datasets.map((dataset) => {
    if (dataset.label !== "Total" && stackStatus === "unstack") {
      {
        dataset.stack = stackStatus;
        dataset.type = "bar";
      }
    } else {
      dataset.stack = undefined;
      dataset.type = "line";
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
