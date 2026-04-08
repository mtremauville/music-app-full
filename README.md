# Music CoverFlow

Monorepo — Rails API + React frontend.

## Lancer le projet

### Backend (port 3001)
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001
```

### Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
