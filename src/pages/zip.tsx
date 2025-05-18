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
  DatasetChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  LineOptions,
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

const UsagePage = ({ data }) => {
  let labels: string[] = [];
  let usage: number[] = [];

  let usageCA5: number[] = [];
  let usageCH2: number[] = [];
  let usageCH41: number[] = [];
  let usageCH42: number[] = [];
  let usageCH43: number[] = [];
  let usageCH45: number[] = [];
  let usageCH46: number[] = [];
  let usageCH47: number[] = [];
  let usageCH49: number[] = [];
  let usageCH60: number[] = [];
  let usageCH61: number[] = [];
  let usageCH62: number[] = [];
  let usageCH63: number[] = [];
  let usageL1: number[] = [];
  let usageL11: number[] = [];
  let usageL12: number[] = [];
  let usageL13: number[] = [];
  let usageL14: number[] = [];
  let usageL15: number[] = [];
  let usageL16: number[] = [];
  let usageL17: number[] = [];
  let usageL18: number[] = [];
  let usageL19: number[] = [];
  let usageL2: number[] = [];
  let usageL20: number[] = [];
  let usageL21: number[] = [];
  let usageL22: number[] = [];
  let usageL23: number[] = [];
  let usageL24: number[] = [];
  let usageL25: number[] = [];
  let usageL26: number[] = [];
  let usageL28: number[] = [];
  let usageL3: number[] = [];
  let usageL31: number[] = [];
  let usageL32: number[] = [];
  let usageL33: number[] = [];
  let usageL34: number[] = [];
  let usageL35: number[] = [];
  let usageL36: number[] = [];
  let usageL37: number[] = [];
  let usageL39: number[] = [];
  let usageL4: number[] = [];
  let usageL40: number[] = [];
  let usageL5: number[] = [];
  let usageL6: number[] = [];
  let usageL7: number[] = [];
  let usageL8: number[] = [];
  let usageL9: number[] = [];
  let usageLA8: number[] = [];
  let usageM21: number[] = [];
  let usagePR8: number[] = [];
  let usagePR9: number[] = [];
  let usageSO14: number[] = [];
  let usageWA10: number[] = [];
  let usageWA7: number[] = [];
  let usageWA8: number[] = [];
  let usageWA9: number[] = [];

  data.allPostcodeCsv.edges.forEach(
    (item: {
      node: {
        CA5_sum: number;
        CH2_sum: number;
        CH41_sum: number;
        CH42_sum: number;
        CH43_sum: number;
        CH45_sum: number;
        CH46_sum: number;
        CH47_sum: number;
        CH49_sum: number;
        CH60_sum: number;
        CH61_sum: number;
        CH62_sum: number;
        CH63_sum: number;
        L1_sum: number;
        L11_sum: number;
        L12_sum: number;
        L13_sum: number;
        L14_sum: number;
        L15_sum: number;
        L16_sum: number;
        L17_sum: number;
        L18_sum: number;
        L19_sum: number;
        L2_sum: number;
        L20_sum: number;
        L21_sum: number;
        L22_sum: number;
        L23_sum: number;
        L24_sum: number;
        L25_sum: number;
        L26_sum: number;
        L28_sum: number;
        L3_sum: number;
        L31_sum: number;
        L32_sum: number;
        L33_sum: number;
        L34_sum: number;
        L35_sum: number;
        L36_sum: number;
        L37_sum: number;
        L39_sum: number;
        L4_sum: number;
        L40_sum: number;
        L5_sum: number;
        L6_sum: number;
        L7_sum: number;
        L8_sum: number;
        L9_sum: number;
        LA8_sum: number;
        M21_sum: number;
        PR8_sum: number;
        PR9_sum: number;
        SO14_sum: number;
        WA10_sum: number;
        WA7_sum: number;
        WA8_sum: number;
        WA9_sum: number;
        Count: number;

        StartDate_first: string;
        EndDate_first: string;
      };
    }) => {
      usage.push(item.node.Count);

      usageCA5.push(item.node.CA5_sum);
      usageCH2.push(item.node.CH2_sum);
      usageCH41.push(item.node.CH41_sum);
      usageCH42.push(item.node.CH42_sum);
      usageCH43.push(item.node.CH43_sum);
      usageCH45.push(item.node.CH45_sum);
      usageCH46.push(item.node.CH46_sum);
      usageCH47.push(item.node.CH47_sum);
      usageCH49.push(item.node.CH49_sum);
      usageCH60.push(item.node.CH60_sum);
      usageCH61.push(item.node.CH61_sum);
      usageCH62.push(item.node.CH62_sum);
      usageCH63.push(item.node.CH63_sum);
      usageL1.push(item.node.L1_sum);
      usageL11.push(item.node.L11_sum);
      usageL12.push(item.node.L12_sum);
      usageL13.push(item.node.L13_sum);
      usageL14.push(item.node.L14_sum);
      usageL15.push(item.node.L15_sum);
      usageL16.push(item.node.L16_sum);
      usageL17.push(item.node.L17_sum);
      usageL18.push(item.node.L18_sum);
      usageL19.push(item.node.L19_sum);
      usageL2.push(item.node.L2_sum);
      usageL20.push(item.node.L20_sum);
      usageL21.push(item.node.L21_sum);
      usageL22.push(item.node.L22_sum);
      usageL23.push(item.node.L23_sum);
      usageL24.push(item.node.L24_sum);
      usageL25.push(item.node.L25_sum);
      usageL26.push(item.node.L26_sum);
      usageL28.push(item.node.L28_sum);
      usageL3.push(item.node.L3_sum);
      usageL31.push(item.node.L31_sum);
      usageL32.push(item.node.L32_sum);
      usageL33.push(item.node.L33_sum);
      usageL34.push(item.node.L34_sum);
      usageL35.push(item.node.L35_sum);
      usageL36.push(item.node.L36_sum);
      usageL37.push(item.node.L37_sum);
      usageL39.push(item.node.L39_sum);
      usageL4.push(item.node.L4_sum);
      usageL40.push(item.node.L40_sum);
      usageL5.push(item.node.L5_sum);
      usageL6.push(item.node.L6_sum);
      usageL7.push(item.node.L7_sum);
      usageL8.push(item.node.L8_sum);
      usageL9.push(item.node.L9_sum);
      usageLA8.push(item.node.LA8_sum);
      usageM21.push(item.node.M21_sum);
      usagePR8.push(item.node.PR8_sum);
      usagePR9.push(item.node.PR9_sum);
      usageSO14.push(item.node.SO14_sum);
      usageWA10.push(item.node.WA10_sum);
      usageWA7.push(item.node.WA7_sum);
      usageWA8.push(item.node.WA8_sum);
      usageWA9.push(item.node.WA9_sum);

      labels.push(item.node.StartDate_first + " to " + item.node.EndDate_first);
    }
  );

  const options: _DeepPartialObject<
    CoreChartOptions<"line"> &
      ElementChartOptions<"line"> &
      PluginChartOptions<"line"> &
      DatasetChartOptions<"line">
  > = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Usage Evolution",
      },
      //   filler: {
      //     // fillStyle: "rgb(255, 161, 99)",
      //     fill: true,
      //   },
      // },
      // fill: true,
      // scales: { y: { stacked: true } },
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
        stack: "total",
      },
      //   {
      //     label: "Usage CA5",
      //     data: usageCA5,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH2",
      //     data: usageCH2,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH41",
      //     data: usageCH41,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH42",
      //     data: usageCH42,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH43",
      //     data: usageCH43,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH45",
      //     data: usageCH45,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH46",
      //     data: usageCH46,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH47",
      //     data: usageCH47,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH49",
      //     data: usageCH49,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH60",
      //     data: usageCH60,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH61",
      //     data: usageCH61,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH62",
      //     data: usageCH62,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage CH63",
      //     data: usageCH63,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      {
        label: "Usage L1",
        data: usageL1,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      //   {
      //     label: "Usage L11",
      //     data: usageL11,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L12",
      //     data: usageL12,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L13",
      //     data: usageL13,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L14",
      //     data: usageL14,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      {
        label: "Usage L15",
        data: usageL15,
        borderColor: "rgb(255, 99, 250)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      {
        label: "Usage L16",
        data: usageL16,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      {
        label: "Usage L17",
        data: usageL17,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      {
        label: "Usage L18",
        data: usageL18,
        borderColor: "rgb(99, 156, 255)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      //   {
      //     label: "Usage L19",
      //     data: usageL19,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L2",
      //     data: usageL2,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L20",
      //     data: usageL20,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L21",
      //     data: usageL21,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L22",
      //     data: usageL22,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L23",
      //     data: usageL23,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L24",
      //     data: usageL24,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L25",
      //     data: usageL25,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L26",
      //     data: usageL26,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L28",
      //     data: usageL28,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      // {
      //   label: "Usage L3",
      //   data: usageL3,
      //   borderColor: "rgb(174, 255, 99)",
      //   backgroundColor: "rgba(174, 255, 99, 0.5)",
      // },

      //   {
      //     label: "Usage L31",
      //     data: usageL31,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L32",
      //     data: usageL32,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L33",
      //     data: usageL33,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L34",
      //     data: usageL34,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L35",
      //     data: usageL35,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L36",
      //     data: usageL36,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L37",
      //     data: usageL37,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage L39",
      //     data: usageL39,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      // {
      //   label: "Usage L4",
      //   data: usageL4,
      //   borderColor: "rgb(174, 255, 99)",
      //   backgroundColor: "rgba(174, 255, 99, 0.5)",
      // },

      //   {
      //     label: "Usage L40",
      //     data: usageL40,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      // {
      //   label: "Usage L5",
      //   data: usageL5,
      //   borderColor: "rgb(174, 255, 99)",
      //   backgroundColor: "rgba(174, 255, 99, 0.5)",
      // },

      // {
      //   label: "Usage L6",
      //   data: usageL6,
      //   borderColor: "rgb(174, 255, 99)",
      //   backgroundColor: "rgba(174, 255, 99, 0.5)",
      // },

      {
        label: "Usage L7",
        data: usageL7,
        borderColor: "rgb(172, 99, 255)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
      },

      // 	  Absolute dataset index 	number 	1, 2, 3, ...
      // Relative dataset index 	string 	'-1', '-2', '+1', ...
      // Boundary 	string 	'start', 'end', 'origin'
      // Disabled 1 	boolean 	false
      // Stacked value below 	string 	'stack'
      // Axis value 	object 	{ value: number; }
      // Shape (fill inside line) 	string 	'shape'

      {
        label: "Usage L8",
        data: usageL8,
        borderColor: "rgb(255, 161, 99)",
        backgroundColor: "rgba(255, 161, 99, 0.5)",
        // stack: stacking == "" ? null : stacking,
        // fillColor: "rgba(215, 249, 63, 0.69)",
        // fill: "rgba(215, 249, 63, 0.69)",
        // strokeColor: "rgb(196, 47, 47)",
        // pointColor: "rgb(155, 25, 151)",
        // pointStrokeColor: "#fff",
        // pointHighlightFill: "#fff",
        // pointHighlightStroke: "rgb(47, 50, 212)",
        // fillStyle: "rgb(255, 161, 99)",
        // fill: true,
      },

      // {
      //   label: "Usage L9",
      //   data: usageL9,
      //   borderColor: "rgb(174, 255, 99)",
      //   backgroundColor: "rgba(174, 255, 99, 0.5)",
      // },

      //   {
      //     label: "Usage LA8",
      //     data: usageLA8,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage M21",
      //     data: usageM21,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage PR8",
      //     data: usagePR8,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage PR9",
      //     data: usagePR9,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage SO14",
      //     data: usageSO14,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage WA10",
      //     data: usageWA10,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage WA7",
      //     data: usageWA7,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage WA8",
      //     data: usageWA8,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
      //   },

      //   {
      //     label: "Usage WA9",
      //     data: usageWA9,
      //     borderColor: "rgb(174, 255, 99)",
      //     backgroundColor: "rgba(174, 255, 99, 0.5)",
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
          CA5_sum
          CH2_sum
          CH41_sum
          CH42_sum
          CH43_sum
          CH45_sum
          CH46_sum
          CH47_sum
          CH49_sum
          CH60_sum
          CH61_sum
          CH62_sum
          CH63_sum
          L1_sum
          L11_sum
          L12_sum
          L13_sum
          L14_sum
          L15_sum
          L16_sum
          L17_sum
          L18_sum
          L19_sum
          L2_sum
          L20_sum
          L21_sum
          L22_sum
          L23_sum
          L24_sum
          L25_sum
          L26_sum
          L28_sum
          L3_sum
          L31_sum
          L32_sum
          L33_sum
          L34_sum
          L35_sum
          L36_sum
          L37_sum
          L39_sum
          L4_sum
          L40_sum
          L5_sum
          L6_sum
          L7_sum
          L8_sum
          L9_sum
          LA8_sum
          M21_sum
          PR8_sum
          PR9_sum
          SO14_sum
          WA10_sum
          WA7_sum
          WA8_sum
          WA9_sum
          Count
        }
      }
    }
  }
`;

export default UsagePage;

export const Head = () => <title>Superb Usage Tool</title>;
