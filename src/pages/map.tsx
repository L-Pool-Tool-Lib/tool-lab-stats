import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { graphql, Link } from "gatsby";
import "./map.css";

const centreCoordinates = [
  Number(process.env.GATSBY_LIBRARY_LATITUDE),
  Number(process.env.GATSBY_LIBRARY_LONGITUDE),
];

const initialZoomLevel = Number(process.env.GATSBY_INITIAL_ZOOM);

const palette = [
  "#03071e",
  "#370617",
  "#6a040f",
  "#9d0208",
  "#d00000",
  "#dc2f02",
  "#e85d04",
  "#f48c06",
  "#faa307",
  "#ffba08",
].reverse();

// TODO: Add a map that only takes into account the start of the postcode
// TODO: take number of people per postcode into account
// TODO: add layers for income/education/density...?

const getColor = (magicNumber: number) => {
  const matchingRange = scales.find(
    (rangeObject) => rangeObject.value >= magicNumber
  );
  if (!matchingRange) {
    // TODO: do something better here
    return "#000000"; // Fallback to black if no range matches
  }
  return matchingRange?.color;
};

const uniqueStartDatesSet = new Set();
const uniqueEndDatesSet = new Set();
let scales: { text: string; value: number; color: string }[];

const prepareCircle = (roughItem: {
  start_date: unknown;
  end_date: unknown;
  latitude: number;
  longitude: number;
  postcode: string;
  Count_sum: string;
}) => {
  uniqueStartDatesSet.add(roughItem.start_date);
  uniqueEndDatesSet.add(roughItem.end_date);

  return {
    position: [roughItem.latitude, roughItem.longitude],
    postcode: roughItem.postcode,
    startDate: roughItem.start_date,
    color: getColor(Number(roughItem.Count_sum)),
    sum: Number(roughItem.Count_sum),
    result:
      "Postcode: " + roughItem.postcode + " - Loans: " + roughItem.Count_sum,
  };
};

const setScale = (maxAmount: number) => {
  let startOfRange = 0;
  let topOfRange = startOfRange + 1;

  const scales = [
    {
      text: topOfRange + " loan",
      value: topOfRange,
      color: palette[startOfRange],
    },
  ];

  const justToString = " to ";
  const loansString = " loans";

  if (palette.length >= maxAmount) {
    for (let index = 1; index < maxAmount; index++) {
      topOfRange = index + 1;
      scales.push({
        text: topOfRange + loansString,
        value: topOfRange,
        color: palette[index],
      });
    }
  } else {
    const availableColors = palette.length - scales.length;
    const step = Math.floor(maxAmount / availableColors);

    for (let index = scales.length; index <= availableColors; index++) {
      startOfRange = topOfRange + 1;
      topOfRange = index * step + 1;

      if (topOfRange > maxAmount) {
        topOfRange = maxAmount;
      }

      if (scales.length === palette.length - 1) {
        topOfRange = maxAmount;
      }

      if (startOfRange > topOfRange) {
        startOfRange = topOfRange;
      }

      scales.push({
        text:
          topOfRange - startOfRange >= 1
            ? startOfRange + justToString + topOfRange + loansString
            : startOfRange + loansString,
        value: topOfRange,
        color: palette[index],
      });
    }
  }

  return scales;
};

const MapPage = ({ data }) => {
  // TODO: give csv file a better name

  const biggestSum = data.allMapCsv.edges.reduce(
    (accumulator: number, currentItem: { node: { Count_sum: number } }) =>
      Number(currentItem.node.Count_sum) > accumulator
        ? Number(currentItem.node.Count_sum)
        : accumulator,
    0
  );

  scales = setScale(biggestSum);
  // TODO: give csv file a better name
  const circles = data.allMapCsv.edges.map(
    (item: {
      node: {
        start_date: unknown;
        end_date: unknown;
        latitude: number;
        longitude: number;
        postcode: string;
        Count_sum: string;
      };
    }) => {
      return prepareCircle(item.node);
    }
  );

  const uniqueStartDates = Array.from(uniqueStartDatesSet);
  const uniqueEndDates = Array.from(uniqueEndDatesSet);

  const [sliderPosition, setSliderPosition] = React.useState(0);

  const handleSliderChange = (event: { target: { value: string } }) => {
    setSliderPosition(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <Link to="/">Home</Link>

      <MapContainer
        style={{ height: "85vh" }}
        center={centreCoordinates}
        zoom={initialZoomLevel}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={centreCoordinates}>
          <Popup>
            The Tool Library. <br /> That's where the tools are.
          </Popup>
        </Marker>
        {circles
          .filter(
            (circle: { startDate: unknown }) =>
              circle.startDate === uniqueStartDates[sliderPosition]
          )
          .map(
            (circle: {
              postcode: string;
              startDate: string;
              position: unknown;
              color: string;
              result:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
            }) => (
              <Circle
                key={circle.postcode + circle.startDate}
                center={circle.position}
                radius="100"
                opacity="0.8"
                fillOpacity="0.5"
                color={circle.color}
              >
                <Popup>{circle.result}</Popup>
              </Circle>
            )
          )}
      </MapContainer>

      <div className="info">
        <div className="scale">
          {scales.map((val) => (
            <div style={{ backgroundColor: val.color }} key={val.value}>
              <p>{val.text}</p>
            </div>
          ))}
        </div>
        <div className="slider">
          <input
            type="range"
            min={0}
            max={uniqueStartDates.length - 1}
            value={sliderPosition}
            onChange={handleSliderChange}
          />
          <p>
            {uniqueStartDates[sliderPosition] +
              " to " +
              uniqueEndDates[sliderPosition]}
          </p>
        </div>
      </div>
    </div>
  );
};

export const query = graphql`
  query MyQuery {
    allMapCsv {
      edges {
        node {
          Count_sum
          latitude
          longitude
          postcode
          start_date
          end_date
        }
      }
    }
  }
`;
export default MapPage;
// TODO: change header for all pages?
export const Head = () => <title>Superb Map Tool</title>;
