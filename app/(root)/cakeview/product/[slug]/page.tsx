import { redirect } from "next/navigation";

interface CakeViewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CakeViewPage({ params }: CakeViewPageProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
