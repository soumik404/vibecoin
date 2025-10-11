import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const twitter = url.searchParams.get("handle");
  if (!twitter) return NextResponse.json({ error: "No handle provided" }, { status: 400 });

  try {
    const res = await fetch(`https://unavatar.io/twitter/${twitter}`);
    const buffer = await res.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err) {
    console.error(err); 
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
