import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET all products (including inactive for admin)
export async function GET() {
  try {
    const { data, error } = await supabase
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

    // Transform database format to application format
    const products = data.map((row: any) => ({
      id: row.id,
      itemNo: row.item_no,
      category: row.category,
      name: row.name,
      images: row.images || [],
      dimensions: row.dimensions,
      packingSize: row.packing_size,
      material: row.material,
      packagingType: row.packaging_type,
      prices: row.prices,
      moq: row.moq,
      innerPack: row.inner_pack,
      containerCapacity: row.container_capacity,
      cartonCBM: row.carton_cbm,
      remark: row.remark,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
