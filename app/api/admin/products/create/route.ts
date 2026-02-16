import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/db/products';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const data = await request.json();

    const product = await createProduct(data);

    // Revalidate all relevant pages
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.id}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
