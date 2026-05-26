export default function UserCard({ user, role }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl flex justify-between shadow-black/50 rounded-lg">
      <div>
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>

        {role === "helpdesk" && (
          <span className="text-xs text-cyan-400">Helpdesk</span>
        )}

        {role === "admin" && (
          <span className="text-xs text-red-400">Admin</span>
        )}
      </div>

      <img src={user?.image || "/avatar.png"}  className="w-14 h-14 rounded-full drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
    </div>
  )
}