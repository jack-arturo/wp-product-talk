const CLIENT_ID = 'Iv23lidHnBiLgTXVi7F5';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const clientSecret = context.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientSecret) {
    return new Response('GITHUB_OAUTH_CLIENT_SECRET not configured', { status: 500 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response(`OAuth error: ${tokenData.error_description || tokenData.error}`, {
      status: 401,
    });
  }

  const token = tokenData.access_token;
  const provider = 'github';

  return new Response(
    `<!DOCTYPE html>
<html><head><title>Authorizing...</title></head>
<body>
<script>
(function() {
  var data = { token: '${token}', provider: '${provider}' };
  var msg = 'authorization:${provider}:success:' + JSON.stringify(data);
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    setTimeout(function() { window.close(); }, 1000);
  } else {
    document.body.innerText = 'Authorization successful. You can close this window.';
  }
})();
</script>
</body></html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
