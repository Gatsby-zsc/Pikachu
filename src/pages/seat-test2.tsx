import { useEffect, useState } from "react";

export type SeatStatus = "available" | "picked" | "reserved";

export interface ReservedSeat {
  row: number;
  col: number;
}

export const useSeatPicker = (
  rows: number,
  cols: number,
  reservedSeats: ReservedSeat[] = []
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
    if (
      seatMap[rowIdx]?.[colIdx] === "available" ||
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
  rows: number;
  cols: number;
  seatMap: SeatStatus[][];
  onSeatToggle: (rowIdx: number, colIdx: number) => void;
}

const SeatPicker: React.FC<SeatPickerProps> = ({
  rows,
  cols,
  seatMap,
  onSeatToggle,
}) => {
  return (
    <div>
      <div className="flex">
        <div className="m-1 h-8 w-8" />
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="m-1 flex h-8 w-8 items-center justify-center"
          >
            {colIdx + 1}
          </div>
        ))}
      </div>
      {seatMap.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          <div className="m-1 flex h-8 w-8 items-center justify-center">
            {rowIdx + 1}
          </div>
          {row.map((seat, colIdx) => (
            <div
              key={colIdx}
              onClick={() => onSeatToggle(rowIdx, colIdx)}
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

const App = () => {
  const rows = 5;
  const cols = 5;
  const reservedSeats = [
    { row: 0, col: 1 },
    { row: 2, col: 3 },
    // Add other reserved seats here
  ];
  const { seatMap, toggleSeat } = useSeatPicker(rows, cols, reservedSeats);

  useEffect(() => {
    console.log(seatMap);
  }, [seatMap]);

  return (
    <div>
      <SeatPicker
        rows={rows}
        cols={cols}
        seatMap={seatMap}
        onSeatToggle={toggleSeat}
      />
    </div>
  );
};

export default App;
