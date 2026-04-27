import { useState } from "react"

export default function UsersTable({ users, onReload }: any) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("user")

  async function changeRole() {
    if (!selectedUser) return
    if (selectedUser.role === "admin") return

    setLoadingId(selectedUser.id)

    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedUser.id,
        role: selectedRole
      })
    })

    setLoadingId(null)
    setSelectedUser(null)
    onReload()
  }

  const getRoleStyles = (role: string) => {
    if (role === "admin") return "bg-red-500/20 text-red-400"
    if (role === "helpdesk") return "bg-cyan-500/20 text-cyan-400"
    return "bg-gray-500/20 text-gray-300"
  }

  return (
    <>
      <div className="bg-zinc-950/80 border border-zinc-700 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[600px] text-center">
          <thead className="text-gray-400 bg-zinc-950">
            <tr>
              <th className="p-3 sm:p-4 text-sm sm:text-base">Email</th>
              <th className="p-3 sm:p-4 text-sm sm:text-base">Rola</th>
              <th className="p-3 sm:p-4 text-sm sm:text-base">Akcja</th>
            </tr>
          </thead>

          <tbody className="bg-zinc-900">
            {users.map((u: any) => (
              <tr
                key={u.id}
                className="border-t border-zinc-700 hover:bg-zinc-800 transition"
              >
                <td className="p-3 sm:p-4 text-gray-200 text-sm sm:text-base break-all">
                  {u.email}
                </td>

                <td className="p-3 sm:p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getRoleStyles(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-3 sm:p-4">
                  {u.role === "admin" ? (
                    <span className="text-red-400 text-xs sm:text-sm">
                      Brak możliwości zmiany
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedUser(u)
                        setSelectedRole(u.role)
                      }}
                      className="px-2 sm:px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded transition text-xs sm:text-sm"
                    >
                      Zmień
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && selectedUser.role !== "admin" && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-zinc-900 p-5 sm:p-6 rounded-xl w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-center">
              Zmień rolę
            </h3>

            <p className="text-center text-gray-400 text-sm break-all">
              {selectedUser.email}
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedRole("user")}
                className={`p-2 rounded transition text-sm ${
                  selectedRole === "user"
                    ? "bg-gray-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                User
              </button>

              <button
                onClick={() => setSelectedRole("helpdesk")}
                className={`p-2 rounded transition text-sm ${
                  selectedRole === "helpdesk"
                    ? "bg-cyan-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Helpdesk
              </button>
            </div>

            <button
              onClick={changeRole}
              disabled={loadingId === selectedUser.id}
              className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-semibold transition text-sm sm:text-base"
            >
              {loadingId === selectedUser.id
                ? "Zmieniam..."
                : "Zmień rolę"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}