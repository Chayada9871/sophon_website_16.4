# Sophon Website Monorepo

This repository is split into two independent Next.js apps so they can be deployed separately on Vercel.

## Apps

- `apps/public-site`
  Customer-facing website for shoppers.
- `apps/staff-site`
  Staff/admin content management website.
- `packages/shared`
  Shared content data, content-management client utilities, and shared styles/components used by both apps.

## Vercel Root Directory

- Public website project: choose `apps/public-site`
- Staff website project: choose `apps/staff-site`

This follows Vercel's monorepo deployment model for separate apps in one repository:
- [Using Monorepos](https://vercel.com/docs/monorepos)

## Environment Variables

Set these in both Vercel projects if both apps should use the same content backend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Set this in the staff project if you want staff buttons to open the live public website:

- `NEXT_PUBLIC_PUBLIC_SITE_URL`

Example:

```bash
NEXT_PUBLIC_PUBLIC_SITE_URL=https://your-public-site.vercel.app
```

## Local Development

Install dependencies once from the repo root:

```bash
npm install
```

Run the public site:

```bash
npm run dev:public
```

Run the staff site:

```bash
npm run dev:staff
```
