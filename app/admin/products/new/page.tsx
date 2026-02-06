import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
