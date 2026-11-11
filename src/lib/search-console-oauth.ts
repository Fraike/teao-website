import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { chooseProperty, SearchConsoleError } from "./search-console-google";

const scope = "https://www.googleapis.com/auth/webmasters.readonly";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export function getGoogleConfig() {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const redirect = process.env.GSC_REDIRECT_URI;
  const key = Buffer.from(process.env.GSC_TOKEN_KEY ?? "", "base64");
  if (!clientId || !clientSecret || !redirect || key.length !== 32) return null;

  try {
    const redirectUri = new URL(redirect);
    if (
      redirectUri.pathname !== "/api/admin/search-console/callback" ||
      (redirectUri.protocol !== "https:" &&
        !(redirectUri.protocol === "http:" && ["localhost", "127.0.0.1"].includes(redirectUri.hostname))) ||
      redirectUri.username || redirectUri.password || redirectUri.search || redirectUri.hash
    ) return null;
    return { clientId, clientSecret, redirectUri, key };
  } catch {
    return null;
  }
}

type GoogleConfig = NonNullable<ReturnType<typeof getGoogleConfig>>;

export function buildGoogleAuthorization(config: GoogleConfig, state: string, challenge: string) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri.href,
    response_type: "code",
    scope,
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  return url;
}

export function protectRefreshToken(refreshToken: string, config: GoogleConfig) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", config.key, iv);
  const ciphertext = Buffer.concat([cipher.update(refreshToken, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64");
}

function readRefreshToken(encrypted: string, config: GoogleConfig) {
  const payload = Buffer.from(encrypted, "base64");
  const decipher = createDecipheriv("aes-256-gcm", config.key, payload.subarray(0, 12));
  decipher.setAuthTag(payload.subarray(12, 28));
  return Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
}

async function exchangeToken(config: GoogleConfig, params: Record<string, string>) {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    body: new URLSearchParams({
      ...params,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new SearchConsoleError(
      response.status === 400
        ? "Google authorization expired or was rejected. Reconnect Google."
        : `Google token endpoint returned HTTP ${response.status}.`,
      response.status,
    );
  }
  const tokens = await response.json() as {
    access_token?: string; refresh_token?: string; scope?: string;
  };
  if (!tokens.access_token || (tokens.scope && !tokens.scope.split(" ").includes(scope))) {
    throw new SearchConsoleError("Google did not grant read access to Search Console.", 403);
  }
  return { accessToken: tokens.access_token, refreshToken: tokens.refresh_token };
}

export async function connectGoogle(config: GoogleConfig, code: string, verifier: string) {
  const { accessToken, refreshToken } = await exchangeToken(config, {
    code,
    code_verifier: verifier,
    redirect_uri: config.redirectUri.href,
    grant_type: "authorization_code",
  });
  if (!refreshToken) throw new Error("Google did not issue a refresh token.");
  const result = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(12000),
  });
  if (!result.ok) throw new Error("Could not verify access to the Search Console property.");
  const { siteEntry = [] } = await result.json() as {
    siteEntry?: { siteUrl: string; permissionLevel: string }[];
  };
  const property = chooseProperty(siteEntry);
  if (!property) return null;
  return { property, refreshToken: protectRefreshToken(refreshToken, config) };
}

export async function accessToken(config: GoogleConfig, encrypted: string) {
  let refreshToken;
  try {
    refreshToken = readRefreshToken(encrypted, config);
  } catch {
    throw new SearchConsoleError("The saved Google credential cannot be decrypted. Reconnect Google.", 400);
  }
  return (await exchangeToken(config, {
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })).accessToken;
}
