export default function Tabs({ tab, setTab, role }: any) {
  const baseTabs = [
    ["all", "Wszystkie"],
    ["new", "Nowe"],
    ["accepted", "Przyjęte"],
    ["closed", "Zamknięte"]
  ]

  const adminTabs = [...baseTabs, ["users", "Użytkownicy"]]

  const tabs = role === "admin" ? adminTabs : baseTabs

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`whitespace-nowrap px-3 py-1 rounded transition text-sm sm:text-base ${
            tab === key
              ? "bg-indigo-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}