import { SeatPicker, useSeatPicker } from "@/components/seat-picker";
import { useEffect } from "react";

const App = () => {
  const rows = 10;
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
      <SeatPicker seatMap={seatMap} onSeatToggle={toggleSeat} />
    </div>
  );
};

export default App;
