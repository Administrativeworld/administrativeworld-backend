import Course from "../models/Course.js";
import Store from "../models/Store.js";
import User from "../models/UserModel.js";

export async function getBasicMetaData(req, res) {
  try {
    // Count total registered students/users
    const totalRegisteredStudent = await User.countDocuments();

    // Count total courses
    const totalCourses = await Course.countDocuments();

    // Count total store items
    const totalStoreItems = await Store.countDocuments();

    // Total study materials = courses + store items
    const totalStudyMaterial = totalCourses + totalStoreItems;

    // Get all courses and sum their purchases
    const courses = await Course.find({}, { purchases: 1 });
    const totalCoursePurchases = courses.reduce((sum, course) => {
      return sum + (course.purchases || 0);
    }, 0);

    // Get all store items and sum their purchases
    const storeItems = await Store.find({}, { purchases: 1 });
    const totalStorePurchases = storeItems.reduce((sum, item) => {
      return sum + (item.purchases || 0);
    }, 0);

    // Total enrolled materials = sum of all purchases from courses and store
    const totalEnrolledMaterials = totalCoursePurchases + totalStorePurchases;

    return res.status(200).json({
      success: true,
      data: {
        totalRegisteredStudent,
        totalCourses,
        totalStudyMaterial,
        totalEnrolledMaterials,
        // Additional useful metadata
        totalStoreItems,
        breakdown: {
          coursePurchases: totalCoursePurchases,
          storePurchases: totalStorePurchases
        }
      }
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      success: false,
      error: 'Failed to fetch metadata',
      details: error.message
    };
  }
}

// Alternative optimized version using aggregation pipeline for better performance
export async function getBasicMetaDataOptimized(req, res) {
  try {
    // Use Promise.all for parallel execution
    const [
      totalRegisteredStudent,
      totalCourses,
      totalStoreItems,
      coursePurchasesResult,
      storePurchasesResult
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Store.countDocuments(),
      Course.aggregate([
        { $group: { _id: null, totalPurchases: { $sum: "$purchases" } } }
      ]),
      Store.aggregate([
        { $group: { _id: null, totalPurchases: { $sum: "$purchases" } } }
      ])
    ]);

    const totalStudyMaterial = totalCourses + totalStoreItems;
    const totalCoursePurchases = coursePurchasesResult[0]?.totalPurchases || 0;
    const totalStorePurchases = storePurchasesResult[0]?.totalPurchases || 0;
    const totalEnrolledMaterials = totalCoursePurchases + totalStorePurchases;

    return res.status(200).json({
      success: true,
      data: {
        totalRegisteredStudent,
        totalCourses,
        totalStudyMaterial,
        totalEnrolledMaterials,
        totalStoreItems,
        breakdown: {
          coursePurchases: totalCoursePurchases,
          storePurchases: totalStorePurchases
        }
      }
    });

  } catch (error) {
    console.error('Error fetching optimized metadata:', error);
    return {
      success: false,
      error: 'Failed to fetch metadata',
      details: error.message
    };
  }
}

// Express.js route handler example
export async function getMetaDataHandler(req, res) {
  try {
    const metadata = await getBasicMetaDataOptimized();

    if (metadata.success) {
      res.status(200).json(metadata);
    } else {
      res.status(500).json(metadata);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}