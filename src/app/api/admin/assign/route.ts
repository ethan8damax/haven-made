import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = [
  "ethandouglasmaxey@gmail.com",
  "carolinejoy.mose@gmail.com",
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY or URL" },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Verify caller
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  try {
    const { data: userRes, error: userErr } = await adminClient.auth.getUser(token);
    if (userErr || !userRes?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = userRes.user.email.toLowerCase();
    const isAdmin = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { userId, clientEmail, video_path, title, wedding_date } = body as {
    userId?: string;
    clientEmail?: string;
    video_path: string;
    title?: string | null;
    wedding_date?: string | null;
  };

  if (!video_path || (!userId && !clientEmail)) {
    return NextResponse.json({ error: "Missing video_path or user identifier" }, { status: 400 });
  }

  // Resolve user id
  let targetUserId = userId || "";
  if (!targetUserId && clientEmail) {
    // Try to find existing user by email (simple scan of first 1000 users)
    let foundId: string | null = null;
    let page = 1;
    while (page <= 10 && !foundId) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 100 });
      if (error) break;
      for (const u of data.users) {
        if ((u.email || "").toLowerCase() === clientEmail.toLowerCase()) {
          foundId = u.id;
          break;
        }
      }
      if (foundId) break;
      if (data.users.length < 100) break;
      page += 1;
    }

    if (!foundId) {
      // Invite user by email
      const { data: inviteData, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(clientEmail);
      if (inviteErr) {
        return NextResponse.json({ error: inviteErr.message }, { status: 500 });
      }
      foundId = inviteData?.user?.id || "";
    }
    targetUserId = foundId || "";
  }

  if (!targetUserId) {
    return NextResponse.json({ error: "Could not resolve user" }, { status: 400 });
  }

  // Insert client_videos row
  const { error: insertErr } = await adminClient.from("client_videos").insert({
    user_id: targetUserId,
    video_path,
    title: title ?? null,
    wedding_date: wedding_date ?? null,
  });
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
