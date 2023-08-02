import { useState } from "react";

export type SeatStatus = "available" | "picked" | "reserved";

export interface ReservedSeat {
  row: number;
  col: number;
}

export const useSeatPicker = (
  rows: number,
  cols: number,
  reservedSeats: ReservedSeat[] = [],
  maxPickedSeats = Infinity // specify the max number of picked seats
) => {
  const initialSeatMap: SeatStatus[][] = Array.from(
    { length: rows },
    (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) =>
        reservedSeats.some(
          (seat) => seat.row === rowIndex && seat.col === colIndex
        )
          ? "reserved"
          : "available"
      )
  );

  const [seatMap, setSeatMap] = useState<SeatStatus[][]>(initialSeatMap);

  const toggleSeat = (rowIdx: number, colIdx: number) => {
    // Counting the number of currently picked seats
    const pickedSeatsCount = seatMap.reduce(
      (count, row) => count + row.filter((seat) => seat === "picked").length,
      0
    );

    // Checking if the seat is available to be picked or if it's already picked
    if (
      (seatMap[rowIdx]?.[colIdx] === "available" &&
        pickedSeatsCount < maxPickedSeats) ||
      seatMap[rowIdx]?.[colIdx] === "picked"
    ) {
      setSeatMap(
        seatMap.map((row, rIdx) =>
          rIdx === rowIdx
            ? row.map((col, cIdx) =>
                cIdx === colIdx
                  ? col === "available"
                    ? "picked"
                    : "available"
                  : col
              )
            : row
        )
      );
    }
  };

  return { seatMap, toggleSeat };
};

export interface Seat {
  row: number;
  col: number;
  status: SeatStatus;
}

interface SeatPickerProps {
  seatMap: SeatStatus[][];
  onSeatToggle: (rowIdx: number, colIdx: number) => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({
  seatMap,
  onSeatToggle,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseOver = (rowIdx: number, colIdx: number) => {
    if (
      isDragging &&
      (seatMap[rowIdx]?.[colIdx] === "available" ||
        seatMap[rowIdx]?.[colIdx] === "picked")
    ) {
      onSeatToggle(rowIdx, colIdx);
    }
  };

  const handleMouseDown = (rowIdx: number, colIdx: number) => {
    if (
      seatMap[rowIdx]?.[colIdx] === "available" ||
      seatMap[rowIdx]?.[colIdx] === "picked"
    ) {
      onSeatToggle(rowIdx, colIdx);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <div className="flex">
        <div className="m-1 h-8 w-8" />
        {Array.from({ length: seatMap[0]?.length as number }).map(
          (_, colIdx) => (
            <div
              key={colIdx}
              className="m-1 flex h-8 w-8 select-none items-center justify-center"
            >
              {colIdx + 1}
            </div>
          )
        )}
      </div>
      {seatMap.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          <div className="m-1 flex h-8 w-8 select-none items-center justify-center">
            {rowIdx + 1}
          </div>
          {row.map((seat, colIdx) => (
            <div
              key={colIdx}
              onMouseOver={() => handleMouseOver(rowIdx, colIdx)}
              onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
              className={`m-1 h-8 w-8 ${
                seat === "available"
                  ? "cursor-pointer bg-green-500"
                  : seat === "picked"
                  ? "cursor-pointer bg-red-500"
                  : "cursor-not-allowed bg-gray-500"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
