import React, { useEffect } from "react";
import { SeatPicker, useSeatPicker } from "@/components/seat-picker";
import { atom, useAtom } from "jotai";
import { seatMapInfoAtom } from "@/components/book-ticket-page/book-detail";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type SeatsDetail = RouterOutput["orderRouter"]["getAllSeats"];

interface SeatGraphProps {
  props: SeatsDetail;
}

export const maxPickedSeatsAtom = atom<number>(0);

export const SeatGraph = ({ props }: SeatGraphProps) => {
  const [, setSeatMapInfo] = useAtom(seatMapInfoAtom);
  const rows = props.maxRow;
  const cols = props.maxCol;
  const reservedSeats = props.reservedSeats;
  const [maxPickedSeats] = useAtom(maxPickedSeatsAtom);

  const { seatMap, toggleSeat } = useSeatPicker(
    rows,
    cols,
    reservedSeats,
    maxPickedSeats
  );

  useEffect(() => {
    setSeatMapInfo(seatMap);
  }, [seatMap, setSeatMapInfo]);

  return (
    <>
      <div className="ml-7 text-center text-lg font-medium text-slate-700">{`You can select up to ${maxPickedSeats} seats.`}</div>
      <div className="flex justify-center">
        <SeatPicker seatMap={seatMap} onSeatToggle={toggleSeat} />
      </div>
      <div className="text-sm text-slate-400">
        <div>Note: Gray seats are reserved.</div>
        <div>Please pick from the green seats.</div>
      </div>
    </>
  );
};
