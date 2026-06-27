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

// type MembershipRow = {
//   Active: number;
//   Month: number;
//   Year: number;
//   Canceled: number;
//   // Changed: number;
//   Downgraded: number;
//   Expired: number;
//   New: number;
//   Renewed: number;
// };

type MembershipRow = {
  Active: string;
  Month: string;
  Year: string;
  Canceled: string;
  // Changed: string;
  Downgraded: string;
  Expired: string;
  New: string;
  Renewed: string;
};

type AnyMembershipRow = MembershipRow & {
  Changed: number;
};

function getDiff(item: MembershipRow): number {
  return (
    Number(item.New) +
    Number(item.Renewed) -
    (Number(item.Canceled) + Number(item.Expired))
  );
  // return item.New - (item.Canceled + item.Expired);
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const ActiveMembershipPage = ({ data }) => {
  const labels: string[] = [];
  const active: number[] = [];
  const anyActive: number[] = [];
  // const cancelled: number[] = [];
  // const changed: number[] = [];
  // const downgraded: number[] = [];
  // const expired: number[] = [];
  // const newMembership: number[] = [];
  // const renewed: number[] = [];

  const aspenActive: number[] = [];
  const concessionActive: number[] = [];
  const employeeActive: number[] = [];
  const payForwardActive: number[] = [];
  const standardActive: number[] = [];
  const volunteerActive: number[] = [];

  data.allMembershipAnyCsv.nodes.forEach((item: AnyMembershipRow) => {
    active.push(Number(item.Active));
    // anyActive.push(getDiff(item));
    // cancelled.push(item.Canceled);
    // anyActive.push(item.Changed);
    // downgraded.push(item.Downgraded);
    // expired.push(item.Expired);
    // newMembership.push(item.New);
    // renewed.push(item.Renewed);
    labels.push(item.Month + "/" + item.Year);
  });

  // allMembershipAspenYardCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }
  data.allMembershipAspenYardCsv.nodes.forEach((item: MembershipRow) => {
    aspenActive.push(getDiff(item));
  });

  // allMembershipConcessionCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }

  data.allMembershipConcessionCsv.nodes.forEach((item: MembershipRow) => {
    concessionActive.push(getDiff(item));
  });

  // allMembershipEmployeeCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }
  data.allMembershipEmployeeCsv.nodes.forEach((item: MembershipRow) => {
    employeeActive.push(getDiff(item));
  });

  // allMembershipPayItForwardCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }
  data.allMembershipPayItForwardCsv.nodes.forEach((item: MembershipRow) => {
    payForwardActive.push(getDiff(item));
  });

  // allMembershipStandardCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }
  data.allMembershipStandardCsv.nodes.forEach((item: MembershipRow) => {
    standardActive.push(getDiff(item));
  });

  // allMembershipVolunteerCsv {
  //   nodes {
  //     Active
  //     Month
  //     Year
  //     Canceled
  //     Changed
  //     Downgraded
  //     Expired
  //     New
  //     Renewed
  //   }
  // }

  data.allMembershipVolunteerCsv.nodes.forEach((item: MembershipRow) => {
    volunteerActive.push(getDiff(item));
  });

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
        text: "Evolution of All Membership Types",
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total",
        data: active,
        borderColor: "rgb(115, 255, 99)",
        backgroundColor: "rgba(115, 255, 99, 0.8)",
      },
      // {
      //   label: "Any Active",
      //   data: anyActive,
      //   borderColor: "rgb(255, 99, 132)",
      //   backgroundColor: "rgba(255, 99, 132, 0.8)",
      // },
      {
        label: "Aspen",
        data: aspenActive,
        borderColor: "rgb(174, 255, 99)",
        backgroundColor: "rgba(174, 255, 99, 0.8)",
      },
      {
        label: "Concessions",
        data: concessionActive,
        borderColor: "rgb(99, 255, 213)",
        backgroundColor: "rgba(99, 255, 213, 0.8)",
      },
      {
        label: "Employees",
        data: employeeActive,
        borderColor: "rgb(255, 161, 99)",
        backgroundColor: "rgba(255, 161, 99, 0.8)",
      },
      {
        label: "Pay it Forward",
        data: payForwardActive,
        borderColor: "rgb(255, 232, 99)",
        backgroundColor: "rgba(255, 232, 99, 0.8)",
      },
      {
        label: "Standard",
        data: standardActive,
        borderColor: "rgb(99, 156, 255)",
        backgroundColor: "rgba(99, 130, 255, 0.8)",
      },
      {
        label: "Volunteers",
        data: volunteerActive,
        borderColor: "rgb(172, 99, 255)",
        backgroundColor: "rgba(172, 99, 255, 0.8)",
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
    allMembershipAspenYardCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
    allMembershipConcessionCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
    allMembershipEmployeeCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
    allMembershipPayItForwardCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
    allMembershipStandardCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
    allMembershipVolunteerCsv {
      nodes {
        Active
        Month
        Year
        Canceled
        Downgraded
        Expired
        New
        Renewed
      }
    }
  }
`;

export default ActiveMembershipPage;

export const Head = () => <title>Superb Usage Tool</title>;
