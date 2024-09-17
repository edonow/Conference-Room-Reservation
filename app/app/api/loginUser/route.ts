import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: string = `${process.env.API_URL}/token`;

  const value: string = req.nextUrl.search;

  const params: URLSearchParams = new URLSearchParams(value);

  const username: string | null = params.get("email");
  const password: string | null = params.get("password");

  if (username === null || password === null) {
    return NextResponse.json({ status: 400, message: "username or password is missing" });
  }

  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (!res.ok) {
    return new NextResponse(res.statusText, { status: res.status });
  }

  let data;
  if (res.headers.get("content-type")?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return NextResponse.json(data);
}
