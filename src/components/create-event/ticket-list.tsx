import { ticketsAtom } from "@/components/create-event/create-event-form";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export const TicketList = () => {
  const [tickets, setTickets] = useAtom(ticketsAtom);

  const removeTicket = (idTemp: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.idTemp !== idTemp));
  };

  return (
    <div>
      {tickets.map((ticket) => (
        <div className="my-2 flex items-center space-x-2" key={ticket.idTemp}>
          <div className="container flex-1 rounded border bg-slate-200 py-2 shadow-sm">
            <div className="flex justify-between">
              <h1 className="font-heading text-xl font-semibold">
                {ticket.ticketName}
              </h1>
              <h1 className="font-heading text-xl font-semibold">
                ${ticket.ticketPrice}
              </h1>
              <h1 className="font-heading text-xl font-semibold">
                {ticket.ticketQuantity}
                <span className="text-base font-normal"> left</span>
              </h1>
            </div>
            <p className="text-gray-600">{ticket.ticketDescription}</p>
          </div>
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => removeTicket(ticket.idTemp)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
      ))}
    </div>
  );
};
