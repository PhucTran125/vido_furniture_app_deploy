import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory, getCategoryProductCount } from '@/lib/db/categories';

// PUT /api/admin/categories/[id] — update category name
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await updateCategory(Number(id), name.trim());
    return NextResponse.json(category);
  } catch (error: any) {
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] — delete category (only if no products)
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    // Check if any products belong to this category
    const productCount = await getCategoryProductCount(categoryId);
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${productCount} product(s) still belong to this category. Reassign them first.` },
        { status: 409 }
      );
    }

    await deleteCategory(categoryId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
