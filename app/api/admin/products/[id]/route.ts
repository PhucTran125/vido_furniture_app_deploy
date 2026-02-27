import { NextResponse } from 'next/server';
import { updateProduct } from '@/lib/db/products';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';

// Helper to generate slug matching the route format
function generateSlug(name: string, itemNo: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const itemSlug = itemNo.toLowerCase();
  return `${nameSlug}-${itemSlug}`;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const data = await request.json();

    const product = await updateProduct(id, data);

    // Revalidate all relevant pages using the correct slug-based path
    const slug = generateSlug(product.name.en, product.itemNo);
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
