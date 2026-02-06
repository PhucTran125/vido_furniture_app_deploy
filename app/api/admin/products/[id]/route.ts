import { NextResponse } from 'next/server';
import { updateProduct } from '@/lib/db/products';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const product = await updateProduct(parseInt(id), data);

    // Revalidate all relevant pages
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.id}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
