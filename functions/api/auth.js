const CLIENT_ID = 'Iv23lidHnBiLgTXVi7F5';
const SCOPES = 'repo,user';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const siteUrl = `${url.protocol}//${url.host}`;

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${siteUrl}/api/callback`,
    scope: SCOPES,
    state: crypto.randomUUID(),
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
