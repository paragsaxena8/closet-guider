import { notFound } from "next/navigation";

import { PlaceholderPage } from "@/components/placeholder-page";

const sections = {
  wardrobe: {
    title: "Wardrobe",
    description: "Your clothing collection will live here.",
  },
  outfits: {
    title: "Outfits",
    description: "Build and revisit outfit combinations.",
  },
  profile: {
    title: "Account",
    description: "Manage your personal profile.",
  },
  preferences: {
    title: "Preferences",
    description: "Set your style and app preferences.",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const page = sections[section as keyof typeof sections];

  if (!page) {
    notFound();
  }

  return <PlaceholderPage title={page.title} description={page.description} />;
}
