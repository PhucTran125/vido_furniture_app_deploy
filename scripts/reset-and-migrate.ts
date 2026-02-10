// Reset database and migrate products with new JSONB schema
// IMPORTANT: Load environment variables FIRST
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../lib/constants';

// Verify environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function resetAndMigrate() {
  console.log('🔄 Resetting products database...\n');

  // Step 1: Delete all existing products
  console.log('🗑️  Deleting existing products...');
  const { error: deleteError } = await supabaseAdmin
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

  if (deleteError) {
    console.error('❌ Error deleting products:', deleteError);
    throw deleteError;
  }
  console.log('✅ All existing products deleted\n');

  // Step 2: Migrate products with new JSONB schema
  console.log('🚀 Starting product migration with JSONB schema...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of PRODUCTS) {
    try {
      console.log(`📦 Migrating: ${product.name.en} (${product.itemNo})`);

      const dbProduct = {
        item_no: product.itemNo,
        category: product.category,

        // JSONB fields
        name: product.name,
        description: product.description || null,
        material: product.material || null,
        packaging_type: product.packagingType || null,
        remark: product.remark || null,
        images: product.images,
        prices: product.prices || null,

        // Simple fields
        dimensions: product.dimensions || null,
        packing_size: product.packingSize || null,
        moq: product.moq || null,
        inner_pack: product.innerPack || null,
        container_capacity: product.containerCapacity || null,
        carton_cbm: product.cartonCBM || null,
        set_components: product.setComponents || null,

        // Metadata
        is_active: product.isActive !== false, // Default to true
      };

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(dbProduct)
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Success! ID: ${data.id}`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception:`, err);
      errorCount++;
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${PRODUCTS.length}\n`);

  if (errorCount === 0) {
    console.log('🎉 All products migrated successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Refresh your browser to test the products');
    console.log('   2. Verify all product data displays correctly\n');
  } else {
    console.log('⚠️  Some products failed to migrate. Check the errors above.');
  }
}

// Run migration
resetAndMigrate()
  .then(() => {
    console.log('✨ Reset and migration completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Migration failed:', err);
    process.exit(1);
  });
