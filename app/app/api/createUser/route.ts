import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: string = `${process.env.API_URL}/user`;

  const value: string = req.nextUrl.search;

  const params: URLSearchParams = new URLSearchParams(value);

  const firstName: string | null = params.get("firstName");
  const lastName: string | null = params.get("lastName");
  const organization: string | null = params.get("organization");
  const email: string | null = params.get("email");
  const password: string | null = params.get("password");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      firstName: `${firstName}`,
      lastName: `${lastName}`,
      organization: `${organization}`,
      email: `${email}`,
      password: `${password}`,
    }),
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
