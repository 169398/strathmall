import { redirect } from "next/navigation";

interface QuickViewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function QuickViewPage({ params }: QuickViewPageProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
  