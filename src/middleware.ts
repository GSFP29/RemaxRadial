import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// /painel fica só em português, sem passar pelo next-intl — precisa é da
// sessão Supabase. O resto (site público) passa pelo next-intl para
// resolver a língua a partir do URL/cookie/Accept-Language.
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/painel")) {
    return await updateSession(request);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/painel/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
