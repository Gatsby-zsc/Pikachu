import { useState } from "react";
import { PlusSquare, MinusSquare } from "lucide-react";

interface Ticket {
  id: number;
  ticketName: string;
  ticketDescription: string;
  price: number;
  capacity: number;
  remaining: number;
}

interface TicketCardProps {
  ticketData: Ticket;
}

export function TicketCard({
  ticketData,
  updateTicketCount,
}: TicketCardProps & {
  updateTicketCount: (ticketId: number, count: number) => void;
}) {
  const [count, setCount] = useState(0);
  const soldOut = ticketData.remaining === 0;

  const increase = () => {
    if (!soldOut && count < ticketData.remaining) {
      const newCount = count + 1;
      setCount(newCount);
      updateTicketCount(ticketData.id, newCount);
    }
  };

  const decrease = () => {
    if (!soldOut && count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateTicketCount(ticketData.id, newCount);
    }
  };

  return (
    <div
      className={`mb-2 w-full rounded-lg border py-4 shadow ${
        soldOut ? "text-slate-400" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b px-4 pb-4">
        <p className="text-lg font-semibold">{ticketData.ticketName}</p>
        <div className="flex flex-row items-center">
          {!soldOut && <MinusSquare className="h-7 w-7" onClick={decrease} />}
          {!soldOut && (
            <span className="mx-3 text-xl font-semibold">{count}</span>
          )}
          {!soldOut && <PlusSquare className="h-7 w-7" onClick={increase} />}
          {soldOut && (
            <span className="mt-4 text-xl font-semibold">Sold Out</span>
          )}
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="text-base font-normal">{ticketData.ticketDescription}</p>
        <div className="flex justify-between">
          <p className="mt-4 text-xl font-semibold">
            {ticketData.price === 0 ? "Free" : `$${ticketData.price}`}
          </p>
          {!soldOut && (
            <p className="mt-4 text-xl font-semibold">
              {ticketData.remaining} left
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
