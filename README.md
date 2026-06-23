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

## Firebase setup (Pedidos en tiempo real)

1. Copia `.env.example` a `.env.local`.
2. Llena los valores `NEXT_PUBLIC_FIREBASE_*` con tu proyecto de Firebase.
3. Crea una colección `pedidos` en Firestore.
4. Reinicia el servidor con `npm run dev`.

Si no configuras Firebase, la app sigue funcionando con almacenamiento local.

## Migración de autenticación (Fase 2A)

Se agregó un feature flag para migrar sin romper el flujo actual:

- `NEXT_PUBLIC_AUTH_MIGRATION_MODE=firebase` (default): usa Firebase Auth Email/Password para admin/cocina.
- `NEXT_PUBLIC_AUTH_MIGRATION_MODE=hybrid`: intenta Firebase Auth y, si falla, vuelve al sistema actual.
- `NEXT_PUBLIC_AUTH_MIGRATION_MODE=legacy`: usa el sistema previo (solo compatibilidad temporal).

Variables requeridas para login por rol en Firebase:

- `NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL`
- `NEXT_PUBLIC_FIREBASE_COCINA_EMAIL`

Prueba rápida de login Firebase (Fase 2A):

1. En Firebase Console habilita **Authentication > Sign-in method > Email/Password**.
2. Crea las cuentas de admin y cocina.
3. Configura en `.env.local`:
   - `NEXT_PUBLIC_AUTH_MIGRATION_MODE=firebase`
   - `NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL=...`
   - `NEXT_PUBLIC_FIREBASE_COCINA_EMAIL=...`
4. Reinicia con `npm run dev`.
5. En `/admin`, selecciona rol y usa la contraseña de esa cuenta de Firebase Auth.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
