# 🛠️ Helpdesk Ticket System

Nowoczesny system zgłoszeń (ticketing system) zbudowany w Next.js.  
Aplikacja umożliwia tworzenie, obsługę i zamykanie ticketów przez użytkowników oraz zespół helpdesk.

---

## 🚀 Funkcje

- 🔐 Logowanie przez GitHub (NextAuth)
- 📝 Tworzenie ticketów przez użytkowników
- 👨‍💻 Panel helpdesk
- 📌 Przypisywanie ticketów do pracowników
- 📊 Statusy: Open / Pending / Closed
- 🎯 Filtrowanie ticketów (Nowe / Zaakceptowane / Zamknięte)
- 💬 Podgląd szczegółów ticketu w modalach
- ⚡ Szybki update statusów (bez reloadu strony)

## 🧰 Technologie

### Frontend
- ⚛️ Next.js (App Router)
- ⚡ React
- 🎨 Tailwind CSS
- 🔐 NextAuth.js

### Backend
- 🗄️ Supabase (PostgreSQL)
- 🔌 Next.js API Routes

### Auth
- 🔑 NextAuth (GitHub Provider)
- 🧑 Role-based access (user / helpdesk)



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

