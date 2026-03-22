import { BlogForm } from '@/components/admin/BlogForm';
import { getBlogById } from '@/lib/db/blogs';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="py-6">
      <BlogForm mode="edit" blog={blog} />
    </div>
  );
}
