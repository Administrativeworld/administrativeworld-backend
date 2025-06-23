import Exercise from "../models/Exercise.js";
import Question from "../models/Question.js";
import Section from "../models/Section.js";
import UserModel from "../models/UserModel.js";
import UserAnswer from "../models/UserAnswer.js";
import mailSender from "../utils/MailSender.js";
import { answerCheckedEmail } from "../mail/templates/answerCheckedEmail.js";
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
        points: questionData.points || 10,
      });
      const savedQuestion = await question.save();
      createdQuestions.push(savedQuestion._id);
    }

    // Create exercise
    const exercise = new Exercise({
      title,
      description,
      questions: createdQuestions,
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
      exercise: savedExercise,
    });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exercise",
      error: error.message,
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
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise",
      error: error.message,
    });
  }
};

// Submit user answer
export const submitAnswer = async (req, res) => {
  try {
    const { exerciseId, questionId } = req.params;
    const {
      answerText,
      attachmentUrl,
      attachment_public_id,
      attachment_format,
      attachment_bytes,
    } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    // Check if answer already exists for this user, exercise, and question
    let userAnswer = await UserAnswer.findOne({
      user: userId,
      exercise: exerciseId,
      question: questionId,
    });

    if (userAnswer) {
      // Update existing answer
      userAnswer.answerText = answerText || userAnswer.answerText;
      userAnswer.attachmentUrl = attachmentUrl || userAnswer.attachmentUrl;
      userAnswer.attachment_public_id =
        attachment_public_id || userAnswer.attachment_public_id;
      userAnswer.attachment_format =
        attachment_format || userAnswer.attachment_format;
      userAnswer.attachment_bytes =
        attachment_bytes || userAnswer.attachment_bytes;
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
        isSubmitted: true,
      });
    }

    const savedAnswer = await userAnswer.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      answer: savedAnswer,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};

// Get user's answers for an exercise
export const getUserAnswers = async (req, res) => {
  console.log({ "get awser user called": "" });
  try {
    const { exerciseId } = req.query;
    const userId = req.user.id;
    const answers = await UserAnswer.find({
      user: userId,
      exercise: exerciseId,
    })
      .populate("question")
      .populate({
        path: "user",
        select: "_id firstName lastName email image",
      })
      .exec();
    console.log(answers);
    res.status(200).json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch answers",
      error: error.message,
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
          path: "questions",
        },
      })
      .exec();

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    console.error("Error fetching section content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch section content",
      error: error.message,
    });
  }
};

// Get user's answers for an exercise
export const getUserAnswersAdmin = async (req, res) => {
  console.log("get awser user Admin called");
  try {
    const { exerciseId } = req.query;
    const userId = req.user.id;
    const answers = await UserAnswer.find({
      exercise: exerciseId,
    })
      .populate("question")
      .populate({
        path: "user",
        select: "_id firstName lastName email image",
      })
      .exec();
    console.log(answers);
    res.status(200).json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch answers",
      error: error.message,
    });
  }
};
export async function answerCheckedNotificationEmail(answerId) {
  console.log("answerCheckedNotificationEmail s call");
  try {
    const answer = await UserAnswer.findById(answerId)
      .populate({
        path: "user",
        model: UserModel,
      })
      .populate({
        path: "question",
        model: Question,
      })
      .populate({
        path: "exercise",
        model: Exercise,
      });

    if (!answer) {
      throw new Error("Answer not found");
    }

    const user = answer.user;
    const question = answer.question;
    const exercise = answer.exercise;

    if (!user || !user.email) {
      throw new Error("User or user email not found for this answer");
    }

    const emailHtml = answerCheckedEmail({
      name: user.firstName || user.name || "User",
      questionText: question?.text || "Your Question",
      exerciseTitle: exercise?.title || "Your Exercise",
      checkDate: new Date().toLocaleDateString(),
    });

    const mailResponse = await mailSender(
      user.email,
      "✅ Your Answer Has Been Reviewed",
      emailHtml
    );

    console.log("✅ Email sent successfully:", mailResponse.response);
  } catch (error) {
    console.error("❌ Error sending answer checked email:", error);
    throw error;
  }
}
export const updateUserAnswerAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { attachmentUrl, format, bytes, resource_type } = req.body;
    const updated = await UserAnswer.findByIdAndUpdate(
      id,
      {
        attachmentUrl,
        attachment_format: format,
        attachment_bytes: bytes,
        attachment_resource_type: resource_type,
        isChecked: true,
      },
      { new: true }
    );
    answerCheckedNotificationEmail(id);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `UserAnswer with ID ${id} not found`,
      });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update UserAnswer",
      error: error.message,
    });
  }
};
