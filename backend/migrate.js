const mongoose = require('mongoose');

// Connection strings
const localDB = 'mongodb://localhost:27017/vezeeta_db';
const atlasDB = 'mongodb+srv://alaahussein20_db_user:projectsoftware@project.sz8j3z2.mongodb.net/vezeeta_db';

// Create two separate connections
const localConnection = mongoose.createConnection(localDB);
const atlasConnection = mongoose.createConnection(atlasDB);

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');
    
    // Wait for both connections
    await Promise.all([
      new Promise((resolve) => localConnection.once('open', resolve)),
      new Promise((resolve) => atlasConnection.once('open', resolve))
    ]);
    
    console.log('✅ Connected to both databases');
    
    // Get all collections from local database
    const collections = await localConnection.db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate`);
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n🔄 Migrating collection: ${collectionName}`);
      
      // Get data from local collection
      const localCollection = localConnection.db.collection(collectionName);
      const documents = await localCollection.find({}).toArray();
      
      if (documents.length > 0) {
        // Insert into Atlas collection
        const atlasCollection = atlasConnection.db.collection(collectionName);
        
        // Clear existing data in Atlas (optional - remove if you want to keep existing data)
        await atlasCollection.deleteMany({});
        
        // Insert documents
        await atlasCollection.insertMany(documents);
        console.log(`✅ Migrated ${documents.length} documents from ${collectionName}`);
      } else {
        console.log(`⚠️  No documents found in ${collectionName}`);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await localConnection.close();
    await atlasConnection.close();
    console.log('🔒 Connections closed');
    process.exit(0);
  }
}

migrateData();
