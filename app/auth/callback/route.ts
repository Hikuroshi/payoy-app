import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  let next = searchParams.get("next") ?? "/dashboard";

  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = next;
  redirectUrl.search = "";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  redirectUrl.searchParams.set("error", "invalid_recovery_link");
  return NextResponse.redirect(redirectUrl);
}
