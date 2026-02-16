import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { dbProductToProduct } from '@/lib/db/products';
import { requireAdminAuth } from '@/lib/auth/session';

// GET all products (including inactive for admin)
export async function GET() {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    const products = data.map(dbProductToProduct);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
