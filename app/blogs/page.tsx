import Link from "next/link";

export default function BlogsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Blogs</h1>

      <Link
        href="/blogs/kitchen"
        className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Open Kitchen Blog
      </Link>
    </div>
  );
}