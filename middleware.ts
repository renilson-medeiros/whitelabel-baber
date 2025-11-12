import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyJWT(token: string, secret: string) {
  try {
    const [, payloadBase64, signatureBase64] = token.split(".");
    if (!payloadBase64 || !signatureBase64) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const data = encoder.encode(`${token.split(".")[0]}.${payloadBase64}`);
    const signature = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid) return null;

    // retorna o payload decodificado
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Libera acesso ao login sem autenticação
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const payload = await verifyJWT(token, process.env.JWT_SECRET!);

  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
