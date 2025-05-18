import * as React from "react";
import type { HeadFC } from "gatsby";

import { Link } from "gatsby";

const IndexPage = () => {
  return (
    <main>
      <h1>LTL graphs</h1>
      <p>
        <Link to="/zip">Usage sorted by postcode</Link>
      </p>
      <p>
        <Link to="/usage">Usage sorted by gender</Link>
      </p>
      <p>
        <Link to="/year-on-year">Year-on-year usage</Link>
      </p>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
