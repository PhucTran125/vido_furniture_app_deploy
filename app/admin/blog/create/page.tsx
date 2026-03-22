import { BlogForm } from '@/components/admin/BlogForm';

export default function CreateBlogPage() {
  return (
    <div className="py-6">
      <BlogForm mode="create" />
    </div>
  );
}
