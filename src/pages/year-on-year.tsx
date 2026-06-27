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
import dayjs, { Dayjs } from "dayjs";
import WeekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function average(sumArray: number[]): number {
  let sum = 0;
  for (let i = 0; i < sumArray.length; i++) {
    sum = sum + Number(sumArray[i]);
  }
  console.log("sum", sum);
  console.log("sumArray length", sumArray.length);
  console.log(sum / sumArray.length);
  return sum / sumArray.length;
}

function getYearWeekLabels() {
  const year = [];
  for (let i = 0; i < 52; i++) {
    year.push("Week " + (1 + i));
  }
  console.log(`added ${year.length} zeroes for the weeks`);
  return year;
}

function getZeroedYearWeeks() {
  const year = [];
  for (let i = 0; i < 52; i++) {
    year.push(0);
  }
  return year;
}

function getDateWeek(date: Date) {
  // const currentDate = typeof date === "object" ? date : new Date();
  const januaryFirst = new Date(date.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    date.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday,
  );

  const weekNumber =
    date.getMilliseconds() < nextMonday.getMilliseconds()
      ? 52
      : date.getMilliseconds() > nextMonday.getMilliseconds()
        ? Math.ceil(
            (date.getMilliseconds() - nextMonday.getMilliseconds()) /
              (24 * 3600 * 1000) /
              7,
          )
        : 1;

  return weekNumber;
}

function getCorrectWeekYear(date: Dayjs): number {
  const year = date.year();
  const week = date.week();
  const month = date.month();
  // if jan && week > 40 = year -1
  if (month === 0 && week > 40) {
    console.log(`Forcing year of date ${date.toString()} to ${year - 1}`);
    return year - 1;
  }
  // if dec && week > 10 = year +1
  if (month === 11 && week < 10) {
    console.log(`Forcing year of date ${date.toString()} to ${year + 1}`);
    return year + 1;
  }
  return year;
}

// function getDateForDayJs(rawDate: string): string {
//   const dateElements = rawDate.split("/")

//   return dateElements[2] + "-"

// }

const YearOnYearPage = ({ data }) => {
  const labels: string[] = getYearWeekLabels();
  const usage21: number[] = getZeroedYearWeeks();
  const usage22: number[] = getZeroedYearWeeks();
  const usage23: number[] = getZeroedYearWeeks();
  const usage24: number[] = getZeroedYearWeeks();
  const usage25: number[] = getZeroedYearWeeks();
  const everything: number[] = getZeroedYearWeeks();
  const weekcount: number[] = [];
  const usageAverage: number[] = [];
  // const weekNumber: number = 0;

  data.allGenderCsv.edges.forEach(
    (item: {
      node: {
        Count_sum: number;
        StartDate_first: string;
        EndDate_first: string;
      };
    }) => {
      // labels.push(item.node.StartDate_first + " to " + item.node.EndDate_first);

      // const startDate = new Date(item.node.StartDate_first);
      // const endDate = new Date(item.node.EndDate_first);
      dayjs.extend(WeekOfYear); // use plugin
      dayjs.extend(customParseFormat);

      // const endDate = dayjs(item.node.EndDate_first);
      const startDate = dayjs(item.node.StartDate_first, "DD/MM/YYYY");
      if (!dayjs(item.node.StartDate_first, "DD/MM/YYYY").isValid()) {
        throw new Error(`-${item.node.StartDate_first}- is not valid`);
      }

      // const dayJs = day
      // const weekNumber = getDateWeek(startDate);
      // const weekNumber = getDateWeek(endDate);
      // const startDateMonth = startDate.getMonth();
      // const endDateMonth = endDate.getMonth();
      // const weekNumber = endDate.week();

      // TODO: handle missing weeks

      if (getCorrectWeekYear(startDate) <= 2021) {
        usage21[startDate.week()] = Number(item.node.Count_sum);
      } else if (getCorrectWeekYear(startDate) === 2022) {
        // labels.push("Week " + ++weekNumber);
        usage22[startDate.week()] = Number(item.node.Count_sum);
      } else if (getCorrectWeekYear(startDate) === 2023) {
        usage23[startDate.week()] = Number(item.node.Count_sum);
      } else if (getCorrectWeekYear(startDate) === 2024) {
        usage24[startDate.week()] = Number(item.node.Count_sum);
      } else if (getCorrectWeekYear(startDate) >= 2025) {
        if (Number(item.node.Count_sum) === 0) {
          console.error(`issue with count sum of ${startDate.toString()}`);
          throw new Error(`issue with count sum of ${startDate.toString()}`);
        }
        usage25[startDate.week()] = Number(item.node.Count_sum);
        weekcount.push(startDate.week());
      } else {
        console.error(`issue with ${startDate.toString()}`);
        throw new Error(
          `issue with ${startDate.toString()} / ${item.node.StartDate_first}`,
        );
      }
      everything[startDate.week()] = Number(item.node.Count_sum);
    },
  );

  for (let i = 0; i < labels.length; i++) {
    const weekSum = [];

    weekSum.push(usage21[i]);
    weekSum.push(usage22[i]);
    weekSum.push(usage23[i]);
    weekSum.push(usage24[i]);
    weekSum.push(usage25[i]);

    usageAverage.push(average(weekSum));
  }

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
      {
        label: "everything",
        data: everything,
        borderColor: "rgb(188, 80, 144)",
        backgroundColor: "rgba(188, 80, 144, 0.8)",
        // borderColor: "rgb(0, 70, 100)",
        // backgroundColor: "rgba(0, 70, 100, 0.8)",
      },
      {
        label: "weekcount",
        data: weekcount,
        borderColor: "rgb(188, 80, 144)",
        backgroundColor: "rgba(188, 80, 144, 0.8)",
        // borderColor: "rgb(0, 70, 100)",
        // backgroundColor: "rgba(0, 70, 100, 0.8)",
      },
      {
        label: "Average",
        data: usageAverage,
        borderColor: "rgba(80, 188, 143, 1)",
        backgroundColor: "rgba(80, 188, 143, 0.8)",
        // borderColor: "rgb(0, 70, 100)",
        // backgroundColor: "rgba(0, 70, 100, 0.8)",
      },
    ],
  };

  return (
    <>
      <Link to="/">Home</Link>
      <Line options={options} data={chartData} />
      <p>{usage25.toString()}</p>
      <p>{everything.toString()}</p>
      <p>{weekcount.toString()}</p>
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

export default YearOnYearPage;

export const Head = () => <title>Superb Usage Tool</title>;
