import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthRoute,
  authRoutes,
  privateRoutes,
} from "@/route";
import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "@/i18n/setting";
acceptLanguage.languages(languages);

export const { auth } = NextAuth(authConfig);
export const config = {
  // ... other properties
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|public|public/static/).*)"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const includeLanguage = languages.some(item => nextUrl.pathname.includes(item))
  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;
  if(nextUrl.pathname.includes("/static/") && includeLanguage) {
    //remove prefix -/en - /vi
    return NextResponse.rewrite(new URL(`${req.nextUrl.pathname.slice(3)}`, req.url))
  }
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoute);
  const sliceLanguage = "/"+nextUrl.pathname.split("/")?.[2]
  const isPrivateRoutes = privateRoutes.includes(sliceLanguage);
  const isAuthRoutes = authRoutes.includes(sliceLanguage);

  if (isApiAuthRoute) return null;
  
  if (isAuthRoutes && isLoggedIn)
    return NextResponse.redirect(
      new URL(`/${lng}${DEFAULT_LOGIN_REDIRECT}`, nextUrl)
    );
    
  if (isPrivateRoutes && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if(includeLanguage) callbackUrl = callbackUrl.slice(3)
    if(nextUrl.search) callbackUrl += nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return NextResponse.redirect(new URL(`/${lng}/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  };

  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }
  return NextResponse.next();
});

