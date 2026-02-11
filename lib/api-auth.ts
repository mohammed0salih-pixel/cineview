type CookieMap = Record<string, string>;

function parseCookies(header: string | null): CookieMap {
  if (!header) return {};
  return header.split(';').reduce<CookieMap>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = rest.join('=');
    return acc;
  }, {});
}

function extractTokenFromAuthCookie(value: string | undefined) {
  if (!value) return null;
  const decoded = decodeURIComponent(value);
  if (decoded.startsWith('[')) {
    try {
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      return null;
    }
  }
  return decoded || null;
}

export function getAccessTokenFromRequest(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }

  const cookies = parseCookies(req.headers.get('cookie'));

  if (cookies['sb-access-token']) {
    return decodeURIComponent(cookies['sb-access-token']);
  }

  if (cookies['supabase-auth-token']) {
    return extractTokenFromAuthCookie(cookies['supabase-auth-token']);
  }

  const authCookieKey = Object.keys(cookies).find((key) => key.endsWith('-auth-token'));
  if (authCookieKey) {
    return extractTokenFromAuthCookie(cookies[authCookieKey]);
  }

  return null;
}
