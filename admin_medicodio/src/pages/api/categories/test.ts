import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test database connection
    const { db, client } = await connectToDatabase();
    
    // Verify we can access the collection
    const collection = db.collection('category');
    if (!collection) {
      throw new Error('Category collection not found');
    }

    // Test basic operations
    const count = await collection.countDocuments();
    const categories = await collection.find({}).limit(5).toArray();

    // Get database information
    const dbName = db.databaseName;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      details: {
        database: dbName,
        collections: collectionNames,
        categoryCollection: {
          name: 'category',
          documentCount: count,
          sampleDocuments: categories
        },
        connectionInfo: {
          url: process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') || 'hidden', // Hide credentials
          isConnected: client.isConnected?.() || true
        }
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      checkList: [
        'Verify MONGODB_URI is set in .env.local',
        'Verify MONGODB_DB is set in .env.local',
        'Ensure MongoDB server is running',
        'Check if the database and collection exist',
        'Verify network connectivity to MongoDB server'
      ]
    });
  }
} 