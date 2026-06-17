interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">
        Blog Details
      </h1>

      <p className="text-lg">
        Blog Slug: {slug}
      </p>
    </div>
  );
}
