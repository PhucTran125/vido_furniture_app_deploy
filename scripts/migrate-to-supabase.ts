// IMPORTANT: Load environment variables FIRST
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import Supabase (after env vars are loaded)
import { PRODUCTS } from '../lib/constants';
import { supabaseAdmin } from '../lib/supabase/server';

/**
 * Migration script to move products from constants.ts to Supabase
 * Run this after:
 * 1. Creating your Supabase project
 * 2. Running the schema.sql in Supabase SQL Editor
 * 3. Adding your Supabase credentials to .env.local
 * 
 * To run: npx tsx scripts/migrate-to-supabase.ts
 */

async function migrateProducts() {
  console.log('🚀 Starting product migration to Supabase...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of PRODUCTS) {
    try {
      console.log(`📦 Migrating: ${product.name.en} (${product.itemNo})`);

      // Convert product to database format
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

      // Insert into Supabase
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

    console.log(''); // Empty line for readability
  }

  console.log('─'.repeat(50));
  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${PRODUCTS.length}\n`);

  if (errorCount === 0) {
    console.log('🎉 All products migrated successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify the data in your Supabase dashboard');
    console.log('   2. Test the application: npm run dev');
    console.log('   3. Check product pages are loading from database\n');
  } else {
    console.log('⚠️  Some products failed to migrate. Check the errors above.');
  }
}

// Run migration
migrateProducts()
  .then(() => {
    console.log('✨ Migration script completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Migration failed:', err);
    process.exit(1);
  });
