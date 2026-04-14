import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

const authStorage = createCookieSessionStorage({
  cookie: {
    name: "mandarin_auth",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/mandarin",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function requireAdmin(request: Request) {
  const session = await authStorage.getSession(request.headers.get("Cookie"));
  if (session.get("admin") !== true) {
    throw redirect(`/mandarin/login?from=${encodeURIComponent(new URL(request.url).pathname)}`);
  }
}

export async function isAdmin(request: Request) {
  const session = await authStorage.getSession(request.headers.get("Cookie"));
  return session.get("admin") === true;
}

export async function createAdminSession(redirectTo: string) {
  const session = await authStorage.getSession();
  session.set("admin", true);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await authStorage.commitSession(session) },
  });
}

export async function destroyAdminSession(request: Request) {
  const session = await authStorage.getSession(request.headers.get("Cookie"));
  return redirect("/mandarin", {
    headers: { "Set-Cookie": await authStorage.destroySession(session) },
  });
}

export function checkPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set");
  return input === password;
}
