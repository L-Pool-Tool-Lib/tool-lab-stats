// import * as React from "react";
import React from "react";
import { Link } from "gatsby";

import { type _DeepPartialObject } from "chart.js/dist/types/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  type CoreChartOptions,
  type DatasetChartOptions,
  type ElementChartOptions,
  type PluginChartOptions,
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
  Legend,
);

type StackStatus = "unstack" | "stack";

export type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  stack?: string | undefined;
  type?: "line" | "bar";
};

export type StackyChartOptions = _DeepPartialObject<
  CoreChartOptions<"line"> &
    ElementChartOptions<"line"> &
    PluginChartOptions<"line"> &
    DatasetChartOptions<"line">
>;

export type StackyChartData = {
  labels: string[];
  datasets: Dataset[];
};

type StackyInput = {
  chartData: StackyChartData;
  chartOptions: StackyChartOptions;
};

function makeStackable(
  stackStatus: StackStatus,
  chartData: StackyChartData,
  // chartData: {
  //   labels: string[];
  //   datasets: Dataset[];
  //   // datasets: (
  //   //   | {
  //   //       label: string;
  //   //       data: number[];
  //   //       borderColor: string;
  //   //       backgroundColor: string;
  //   //       stack: string | undefined;
  //   //     }
  //   //   | {
  //   //       label: string;
  //   //       data: number[];
  //   //       borderColor: string;
  //   //       backgroundColor: string;
  //   //       stack?: undefined;
  //   //     }
  //   // )[];
  // }
) {
  const datasets = chartData.datasets.map((dataset) => {
    if (!dataset.label.startsWith("Total") && stackStatus === "unstack") {
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

const StackableLine = ({ chartData, chartOptions }: StackyInput) => {
  //   let stackable: any;
  const [stacking, setStacking] = React.useState("unstack" as StackStatus);
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
