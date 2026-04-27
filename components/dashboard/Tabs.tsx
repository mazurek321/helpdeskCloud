export default function Tabs({ tab, setTab }: any) {
  const tabs = [
    ["all", "Wszystkie"],
    ["new", "Nowe"],
    ["accepted", "Przyjęte"],
    ["closed", "Zamknięte"]
  ]

  return (
    <div className="flex gap-2">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`px-3 py-1 rounded transition ${
              tab === key ? "bg-indigo-600" : "bg-gray-700"
            }`}        >
          {label}
        </button>
      ))}
    </div>
  )
}