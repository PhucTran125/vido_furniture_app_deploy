import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/db/products';
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

export async function POST(request: Request) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const data = await request.json();

    const product = await createProduct(data);

    // Revalidate all relevant pages using the correct slug-based path
    const slug = generateSlug(product.name.en, product.itemNo);
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
