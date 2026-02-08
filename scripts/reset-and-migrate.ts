// Delete all products and re-migrate with correct slugs
// IMPORTANT: Load environment variables FIRST
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../lib/constants';

// Verify environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create admin client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
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
    .neq('id', 0); // Delete all rows

  if (deleteError) {
    console.error('❌ Error deleting products:', deleteError);
    throw deleteError;
  }
  console.log('✅ All existing products deleted\n');

  // Step 2: Migrate products with correct slugs
  console.log('🚀 Starting product migration with name-based slugs...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of PRODUCTS) {
    try {
      console.log(`📦 Migrating: ${product.name.en} (${product.itemNo})`);

      // Generate slug from product name (English) to match frontend URL generation
      const slug = product.name.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const dbProduct = {
        item_no: product.itemNo,
        slug,
        name_en: product.name.en,
        name_vi: product.name.vi,
        category: product.category,
        image: product.image || null,
        description_en: product.description?.en || null,
        description_vi: product.description?.vi || null,
        dimensions: product.dimensions || null,
        material: product.material || null,
        set_components: product.setComponents || null,
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
        console.log(`   ✅ Success! ID: ${data.id}, Slug: ${data.slug}`);
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
    console.log('   1. Refresh your browser to test the product detail pages');
    console.log('   2. All product URLs should now work correctly\n');
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
