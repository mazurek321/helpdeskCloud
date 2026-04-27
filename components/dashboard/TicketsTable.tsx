import { Ticket } from "@/types/ticket"
import { Session } from "next-auth"

type Props = {
  tickets: Ticket[]
  isHelpdesk: boolean
  session: Session
  onSelect: (ticket: Ticket) => void
  onUpdate: (id: number, action: string) => void
}

export default function TicketsTable({
  tickets,
  isHelpdesk,
  session,
  onSelect,
  onUpdate
}: Props) {
  const userEmail = session.user?.email

  const canCloseHelpdesk = (t: Ticket) =>
    t.assigned_to === userEmail && t.status !== "closed"

  const canCloseUser = (t: Ticket) =>
    t.created_by === userEmail && t.status !== "closed"

  const getStatusStyles = (t: Ticket) => {
    if (t.status === "closed")
      return "bg-red-500/20 text-red-400"
    if (t.assigned_to)
      return "bg-blue-500/20 text-blue-400"
    return "bg-yellow-500/20 text-yellow-400"
  }

  if (!tickets.length) {
    return (
      <div className="bg-zinc-750 border border-zinc-600 p-6 rounded-xl text-center text-gray-300">
        Brak ticketów
      </div>
    )
  }

  return (
    <div className="bg-zinc-750 border border-zinc-600 rounded-xl overflow-hidden shadow-[0_0_5px_black]">
      <table className="w-full table-fixed text-center">
        <thead className="bg-zinc-900 text-gray-300 border-b border-zinc-700">
          <tr>
            <th className="p-3">Tytuł</th>
            <th className="p-3">Status</th>
            <th className="p-3">Akcje</th>
          </tr>
        </thead>

        <tbody className="bg-zinc-700">
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="
                border-t border-zinc-500
                cursor-pointer
                hover:bg-zinc-800
                transition
              "
            >
              <td className="p-3 font-medium text-gray-100">
                {t.title}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyles(t)}`}
                >
                  {t.status}
                </span>
              </td>

              <td className="p-3 space-x-2">
                {isHelpdesk &&
                  !t.assigned_to &&
                  t.status !== "closed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdate(t.id, "take")
                      }}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
                    >
                      Przyjmij
                    </button>
                  )}

                {isHelpdesk && canCloseHelpdesk(t) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdate(t.id, "force_close_helpdesk")
                    }}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                  >
                    Zamknij
                  </button>
                )}

                {!isHelpdesk && canCloseUser(t) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdate(t.id, "close")
                    }}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                  >
                    Zamknij
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}