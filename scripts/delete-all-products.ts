// Delete all products from Supabase
// IMPORTANT: Load environment variables FIRST
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import Supabase (after env vars are loaded)
import { supabaseAdmin } from '../lib/supabase/server';

async function deleteAllProducts() {
  console.log('🗑️  Deleting all products from Supabase...\n');

  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .neq('id', 0); // Delete all rows (condition that's always true for all products)

    if (error) {
      console.error('❌ Error deleting products:', error);
      throw error;
    }

    console.log('✅ All products deleted successfully!\n');
  } catch (err) {
    console.error('💥 Failed to delete products:', err);
    process.exit(1);
  }
}

// Run deletion
deleteAllProducts()
  .then(() => {
    console.log('✨ Deletion script completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Deletion failed:', err);
    process.exit(1);
  });
