import { SeatPicker, useSeatPicker } from "@/components/seat-picker";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const App = () => {
  const rows = 10;
  const cols = 5;
  const reservedSeats = [
    { row: 0, col: 1 },
    { row: 2, col: 3 },
    // Add other reserved seats here
  ];
  const [maxPickedSeats, setMaxPickedSeats] = useState(1);

  const { seatMap, toggleSeat } = useSeatPicker(
    rows,
    cols,
    reservedSeats,
    maxPickedSeats
  );

  useEffect(() => {
    console.log(seatMap);
  }, [seatMap]);

  return (
    <div>
      <SeatPicker seatMap={seatMap} onSeatToggle={toggleSeat} />
      <div className="space-x-2">
        <Button onClick={() => setMaxPickedSeats(maxPickedSeats + 1)}>
          Increase
        </Button>
        {`maxPickedSeats: ${maxPickedSeats}`}
        <Button onClick={() => setMaxPickedSeats(maxPickedSeats - 1)}>
          Decrease
        </Button>
      </div>
    </div>
  );
};

export default App;
