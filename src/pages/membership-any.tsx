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
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  PluginChartOptions,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import StackableLine from "../components/stackable-line";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const MembershipPage = ({ data }) => {
  const labels: string[] = [];
  const active: number[] = [];
  const cancelled: number[] = [];
  // const changed: number[] = [];
  const downgraded: number[] = [];
  const expired: number[] = [];
  const newMembership: number[] = [];
  const renewed: number[] = [];

  //     allMembershipAnyCsv {
  // nodes {
  //   Active
  //   Month
  //   Year
  //   Canceled
  //   Changed
  //   Downgraded
  //   Expired
  //   New
  //   Renewed

  data.allMembershipAnyCsv.nodes.forEach(
    (item: {
      // node: {
      // Count_sum: number;
      // male_sum: number;
      // female_sum: number;
      // none_sum: number;
      // unspecified_sum: number;
      // StartDate_first: string;
      // EndDate_first: string;
      Active: string;
      Month: string;
      Year: string;
      Canceled: string;
      Changed: string;
      Downgraded: string;
      Expired: string;
      New: string;
      Renewed: string;
      // };
    }) => {
      active.push(Number(item.Active));
      cancelled.push(-Number(item.Canceled));
      // changed.push(-Number(item.Changed));
      downgraded.push(-Number(item.Downgraded));
      expired.push(-Number(item.Expired));
      newMembership.push(Number(item.New));
      renewed.push(Number(item.Renewed));
      labels.push(item.Month + "/" + item.Year);
    },
  );

  const options: _DeepPartialObject<
    CoreChartOptions<"line"> &
      ElementChartOptions<"line"> &
      PluginChartOptions<"line"> &
      DatasetChartOptions<"line">
  > = {
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
        text: "Evolution of Membership",
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Active",
        data: active,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Cancelled",
        data: cancelled,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.5)",
      },
      // {
      //   label: "Changed",
      //   data: changed,
      //   borderColor: "rgb(99, 255, 213)",
      //   backgroundColor: "rgba(99, 255, 213, 0.5)",
      // },
      {
        label: "Downgraded",
        data: downgraded,
        borderColor: "rgb(255, 161, 99)",
        backgroundColor: "rgba(255, 161, 99, 0.5)",
      },
      {
        label: "Expired",
        data: expired,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.5)",
      },
      {
        label: "New",
        data: newMembership,
        borderColor: "rgb(99, 156, 255)",
        backgroundColor: "rgba(99, 130, 255, 0.5)",
      },
      {
        label: "Renewed",
        data: renewed,
        borderColor: "rgb(172, 99, 255)",
        backgroundColor: "rgba(172, 99, 255, 0.5)",
      },
    ],
  };

  return (
    <>
      <StackableLine chartOptions={options} chartData={chartData} />
      <p>
        <b>Active</b> members are ones with a membership that allows items to be
        checked out to them or that have an associated cost. <br />
        <b>New</b> are where a user becomes an active member for the first time
        or purchased a membership outside of the renewal window. <br />
        <b>Renewed</b> memberships are where the same membership was repurchased
        during the renewal window. <br />
        <b>Changed</b> memberships are ones where there was a change from an
        active membership to different active membership. <br />
        <b>Downgraded</b> means the user changed from an Active Member to one
        that can not check out items and is not paid.
        <br />
        <b>Canceled</b> means the user was deactivated or deleted. <br />
        <b>Expired</b> means the membership expired and was not renewed or
        changed within the renewal window. <br />
        <b>Contacts</b> are all users associated with your site including
        non-members.
      </p>
    </>
  );
};

export const query = graphql`
  query MyQuery {
    allMembershipAnyCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Changed
        Downgraded
        Expired
        New
        Renewed
      }
    }
  }
`;

export default MembershipPage;

export const Head = () => <title>Superb Usage Tool</title>;
