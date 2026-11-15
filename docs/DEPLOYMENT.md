# Deploy Open Doors

## MongoDB Atlas

1. Create a free Atlas cluster for this project.
2. Create a database user scoped to the application database.
3. Configure the Atlas network access list for the deployment’s outbound addresses. Standard Vercel serverless egress is dynamic; choose a supported network configuration appropriate to your Atlas plan.
4. Copy the driver connection string, including the `opendoors` database name. URL-encode special characters in the username/password.
5. Keep it in an ignored `.env` locally and in Vercel’s environment settings for production. Never put it in the React client or any variable prefixed `VITE_`.

## Vercel

Import the GitHub repository or run `vercel --prod`. The project contains `vercel.json` with the Vite build, static output and Express API routing.

Set production environment variables:

- `MONGODB_URI`: Atlas driver URI.
- `SESSION_SECRET`: at least 32 random characters, stable across deployments.

Redeploy after changing environment variables.

Visit `/api/health` and verify `status: ok` and `database: MongoDB`. In a browser, reserve a demo place, reload, and verify the reservation in My plans. Publish an organiser update and verify it under the event’s Updates tab.

## Operational boundaries

- Each browser session is isolated for safe assessment demonstrations. It lasts seven days. Clearing cookies creates a new workspace; it does not delete the previous workspace’s database records.
- Demo events are seeded on first visit. Their dates are upcoming relative to the workspace creation date. Existing sessions retain their original dates.
- No email, payment, real ticketing or public event moderation is included.
- Rate limiting is per serverless instance. A public production service would use shared rate-limit storage, authenticated organiser accounts, data retention, monitoring and recovery jobs for interrupted reservation writes.
- If Atlas is unavailable, the application reports an error rather than pretending to save locally.
