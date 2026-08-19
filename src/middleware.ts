import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Só corre em /painel — o site público não precisa de sessão nem de cliente Supabase.
export const config = {
  matcher: ["/painel/:path*"],
};
