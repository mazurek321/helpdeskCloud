type Form = {
  title: string
  description: string
}

type Props = {
  form: Form
  setForm: (form: Form) => void
  onClose: () => void
  onSubmit: () => void
}

export default function CreateTicketModal({
  form,
  setForm,
  onClose,
  onSubmit
}: Props) {
  const isTitleValid = form.title.trim().length > 0

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-3 border border-zinc-700 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Nowy ticket</h2>

        <div className="space-y-1">
          <input
            className={`w-full p-2 bg-zinc-700 rounded outline-none border ${
              !isTitleValid ? "border-red-500" : "border-transparent"
            }`}
            placeholder="Tytuł *"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {!isTitleValid && (
            <p className="text-xs text-red-400">
              Tytuł jest wymagany
            </p>
          )}
        </div>

        <textarea
          className="w-full h-32 p-2 bg-zinc-700 rounded resize-none outline-none border border-transparent focus:border-indigo-500"
          placeholder="Opis"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Anuluj
          </button>

          <button
            onClick={onSubmit}
            disabled={!isTitleValid}
            className={`px-4 py-2 rounded transition ${
              isTitleValid
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Dodaj
          </button>
        </div>
      </div>
    </div>
  )
}