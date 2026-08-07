ecometer/
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
├── package.json
├── vite.config.js
├── docs/
│ ├── SUPABASE.md
│ ├── PROJECT_STRUCTURE.md
│ └── DEPLOYMENT.md
├── supabase/
│ └── migrations/ # SQL migrations, checked into git
├── public/ # static assets served as-is
└── src/
├── main.jsx
├── App.jsx
├── components/ # shared/reusable UI components
│ └── ui/
├── features/ # feature-scoped code (colocate related component/hooks/types)
│ ├── globe/ # React Three Fiber scene, drag-to-spin, day/night toggle
│ ├── restaurants/ # restaurant list/detail views
│ ├── scoring/ # scoring category display
│ ├── achievements/ # achievement badges/display
│ └── admin/ # gated admin UI for Ewan
├── lib/
│ ├── supabase.js # Supabase client init
│ └── queryClient.js # TanStack Query client config
├── hooks/ # shared hooks (e.g. useRestaurants, useAuth)
├── styles/ # global styles, design tokens (Fraunces/Inter, palette)
└── routes/ # route definitions, if using a router
