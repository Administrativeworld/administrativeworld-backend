import Category from '../models/Category.js';

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(422).json({
        success: false,
        message: "All fields are required",
      });
    }
    const CategoryDetial = await Category.create({
      name: name,
      description: description
    })
    return res.status(200).json({
      success: true,
      message: "Category was successfully Created!",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

export async function showAllCategories(req, res) {
  try {
    const allCategories = await Category.find().select('name _id') // Populate courses

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function categoryPageDetails(req, res) {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    // Handle the case when the category is not found
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }
    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
export async function editCategory(req, res) {
  try {
    const { categoryId, newName } = req.body;
    if (!categoryId || !newName) {
      return res.status(400).json({ error: "Both categoryId and newName are required." });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    category.name = newName;
    await category.save();

    return res.status(200).json({ message: "Category updated successfully.", category });
  } catch (error) {
    console.error("Edit Category Error:", error);
    return res.status(500).json({ error: "Server error while updating category." });
  }
}
export async function deleteCategory(req, res) {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: "categoryId is required." });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({ message: "Category deleted successfully." });

  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({ error: "Server error while deleting category." });
  }
}
