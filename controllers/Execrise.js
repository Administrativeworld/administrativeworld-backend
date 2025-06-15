import Exercise from "../models/Exercise.js";
import Question from "../models/Question.js";
import Section from "../models/Section.js";
import UserAnswer from "../models/UserAnswer.js"

// Create a new exercise (Admin only)
export const createExercise = async (req, res) => {
  try {
    const { title, description, questions, sectionId } = req.body.exerciseData;
    // Create questions first
    const createdQuestions = [];
    for (const questionData of questions) {
      const question = new Question({
        questionText: questionData.questionText,
        questionType: questionData.questionType || "long-answer",
        points: questionData.points || 10
      });
      const savedQuestion = await question.save();
      createdQuestions.push(savedQuestion._id);
    }

    // Create exercise
    const exercise = new Exercise({
      title,
      description,
      questions: createdQuestions
    });

    const savedExercise = await exercise.save();

    // Add exercise to section if sectionId provided
    if (sectionId) {
      await Section.findByIdAndUpdate(
        sectionId,
        { $push: { exercises: savedExercise._id } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      exercise: savedExercise
    });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exercise",
      error: error.message
    });
  }
};

// Get exercise with questions
export const getExercise = async (req, res) => {
  try {
    const { exerciseId } = req.query;

    const exercise = await Exercise.findById(exerciseId)
      .populate("questions")
      .exec();

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    res.status(200).json({
      success: true,
      exercise
    });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise",
      error: error.message
    });
  }
};

// Submit user answer
export const submitAnswer = async (req, res) => {
  try {
    const { exerciseId, questionId } = req.params;
    const { answerText, attachmentUrl, attachment_public_id, attachment_format, attachment_bytes } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    // Check if answer already exists for this user, exercise, and question
    let userAnswer = await UserAnswer.findOne({
      user: userId,
      exercise: exerciseId,
      question: questionId
    });

    if (userAnswer) {
      // Update existing answer
      userAnswer.answerText = answerText || userAnswer.answerText;
      userAnswer.attachmentUrl = attachmentUrl || userAnswer.attachmentUrl;
      userAnswer.attachment_public_id = attachment_public_id || userAnswer.attachment_public_id;
      userAnswer.attachment_format = attachment_format || userAnswer.attachment_format;
      userAnswer.attachment_bytes = attachment_bytes || userAnswer.attachment_bytes;
      userAnswer.submittedAt = new Date();
      userAnswer.isSubmitted = true;
    } else {
      // Create new answer
      userAnswer = new UserAnswer({
        user: userId,
        exercise: exerciseId,
        question: questionId,
        answerText,
        attachmentUrl,
        attachment_public_id,
        attachment_format,
        attachment_resource_type: "image",
        attachment_bytes,
        isSubmitted: true
      });
    }

    const savedAnswer = await userAnswer.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      answer: savedAnswer
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message
    });
  }
};

// Get user's answers for an exercise
export const getUserAnswers = async (req, res) => {
  try {
    const { exerciseId } = req.query;
    const userId = req.user.id;
    const answers = await UserAnswer.find({
      user: userId,
      exercise: exerciseId
    })
      .populate("question")
      .populate({
        path: 'user',
        select: "_id firstName lastName email image"
      })
      .exec();

    res.status(200).json({
      success: true,
      answers
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch answers",
      error: error.message
    });
  }
};

// Get section with subsections and exercises
export const getSectionContent = async (req, res) => {
  try {
    const { sectionId } = req.query;


    const section = await Section.findById(sectionId)
      .populate("subSection")
      .populate({
        path: "exercises",
        populate: {
          path: "questions"
        }
      })
      .exec();


    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    res.status(200).json({
      success: true,
      section
    });
  } catch (error) {
    console.error("Error fetching section content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch section content",
      error: error.message
    });
  }
};