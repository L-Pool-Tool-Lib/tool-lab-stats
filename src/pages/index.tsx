import * as React from "react";
import type { HeadFC } from "gatsby";

import { Link } from "gatsby";

const IndexPage = () => {
  return (
    <main>
      <h1>LTL graphs</h1>
      <p>
        <Link to="/membership-any">Membership Evolution</Link>
      </p>
      <p>
        <Link to="/membership-standard">Membership Evolution (standard)</Link>
      </p>
      <p>
        <Link to="/membership-pay-forward">
          Membership Evolution (pay forward)
        </Link>
      </p>
      <p>
        <Link to="/membership-concession">
          Membership Evolution (concession)
        </Link>
      </p>
      <p>
        <Link to="/active-membership">Evolution of Membership Types</Link>
      </p>
      <p>
        <Link to="/active-membership-split">
          Evolution of Membership Composition
        </Link>
      </p>
      <p>
        <Link to="/zip">Usage split by postcode</Link>
      </p>
      <p>
        <Link to="/gender">Usage split by gender</Link>
      </p>
      <p>
        <Link to="/year-on-year">Year-on-year usage</Link>
      </p>
      <p>
        <Link to="/year-on-year-normal">Normalised year-on-year usage</Link>
      </p>
      <p>
        <Link to="/map">Map</Link>
      </p>
      <p>
        <Link to="/map-sector">Map Sector</Link>
      </p>
      <p>
        <Link to="/map-district">Map District</Link>
      </p>
      <p>
        <Link to="/first">First-time users</Link>
      </p>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
