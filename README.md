# Closet Guider

Closet Guider is a wardrobe-planning app built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. The dashboard contains sample analytics; Wardrobe, Outfits, Account, and Preferences currently use placeholder pages.

## Getting Started

Install dependencies and configure Clerk:

```bash
npm install
npx clerk@latest init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Clerk credentials are stored in `.env.local`; do not commit that file. Configure a production Clerk instance and production environment variables before deploying.

## Routes

- `/` and `/dashboard` - Dashboard
- `/wardrobe` and `/outfits` - Placeholder pages for wardrobe items and outfit planning
- `/profile` - Account placeholder
- `/preferences` - Preferences placeholder
- `/login` - Custom Clerk sign-in with email/password and Google
- `/login?fallback=clerk` - Clerk-hosted password recovery and additional verification
- `/register` - Custom Clerk registration with email verification and Google
- `/sso-callback` - Completes Google sign-in and registration

App routes are protected by Clerk in `proxy.ts`. Sign-in, registration, and the SSO callback are public routes.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the repository with Prettier |
| `npm run format:check` | Check formatting without writing changes |

Prettier uses the Tailwind CSS plugin to sort utility classes, including classes passed through `cn` and `cva`.
