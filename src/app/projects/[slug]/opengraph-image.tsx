import { ImageResponse } from "next/og";
import { projects } from "@/lib/data";
import { OgCard, ogSize, ogContentType, ogFonts } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Project — Omswaroop T M";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return new ImageResponse(
    <OgCard eyebrow={p?.category ?? "Project"} title={p?.title ?? "Project"} />,
    { ...size, fonts: ogFonts }
  );
}
