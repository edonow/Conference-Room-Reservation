import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);

  const userId: string | null = params.get("userId");
  const isAdminParam: string | null = params.get("isAdmin");
  const isAdmin: boolean = isAdminParam ? isAdminParam === "true" : false;

  const url: string = `${process.env.API_URL}/admin/isadmin/user/${userId}?is_admin=${isAdmin}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Cache-Control": "no-cache",
    },
    // cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to post data: ${res.statusText}`);
  }

  let data;
  if (res.headers.get("content-type")?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return NextResponse.json(data);
}
