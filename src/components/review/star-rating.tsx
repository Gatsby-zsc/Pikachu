import { type SetStateAction, type Dispatch } from "react";
// import * as React from "react";
import { Rating } from "react-simple-star-rating";
interface StarRatingProps {
  setRating: Dispatch<SetStateAction<number>>;
}

const tooltipArray = [
  "0.5",
  "1.0",
  "1.5",
  "2.0",
  "2.5",
  "3.0",
  "3.5",
  "4.0",
  "4.5",
  "5.0",
];
const fillColorArray = [
  "#f17a45",
  "#f17a45",
  "#f19745",
  "#f19745",
  "#f1a545",
  "#f1a545",
  "#f1b345",
  "#f1b345",
  "#f1d045",
  "#f1d045",
];

export function StarRating(props: StarRatingProps) {
  const { setRating } = props;

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value: number, index: number) =>
    console.log(value, index);

  return (
    <div className="">
      <Rating
        onClick={handleRating}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        SVGstyle={{ display: "inline-block" }}
        transition
        allowFraction
        showTooltip
        tooltipArray={tooltipArray}
        fillColorArray={fillColorArray}
        /* Available Props */
      />
    </div>
  );
}
