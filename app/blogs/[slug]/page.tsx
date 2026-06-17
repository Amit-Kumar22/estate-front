interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">
        Blog Details
      </h1>

      <p className="text-lg">
        Blog Slug: {params.slug}
      </p>
    </div>
  );
}