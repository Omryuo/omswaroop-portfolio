import { ImageResponse } from "next/og";
import { research } from "@/lib/data";
import { OgCard, ogSize, ogContentType, ogFonts } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Research — Omswaroop T M";

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = research.find((x) => x.slug === slug);
  return new ImageResponse(
    <OgCard eyebrow={`${r?.venue ?? "Research"} · Publication`} title={r?.title ?? "Research"} />,
    { ...size, fonts: ogFonts }
  );
}
