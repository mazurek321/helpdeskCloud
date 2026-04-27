export default function UserCard({ user, isHelpdesk }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl flex justify-between shadow-[0_0_3px_black]">
      <div>
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>

        {isHelpdesk && (
          <span className="text-xs text-cyan-400">Helpdesk</span>
        )}
      </div>

      <img src={user.image} className="w-14 h-14 rounded-full" />
    </div>
  )
}