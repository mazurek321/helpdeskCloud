import { Ticket } from "@/types/ticket"

type Props = {
  ticket: Ticket
  onClose: () => void
}

export default function TicketModal({ ticket, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-800 p-6 rounded-xl w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">{ticket.title}</h2>

        <p className="text-gray-300">{ticket.description}</p>

        <div className="pt-6 space-y-1">
          <p className="text-sm text-gray-400">
            Status: {ticket.status}
          </p>

          <p className="text-sm text-gray-400">
            Wystawił: {ticket.created_by}
          </p>

          {ticket.assigned_to ? (
            <p className="text-sm text-cyan-400">
              Obsługuje: {ticket.assigned_to}
            </p>
          ) : (
            ticket.status !== "open" && (
              <p className="text-sm text-gray-500">
                Brak przypisanego helpdesku
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}