/**
 * FineBot English Application Engine
 *
 * Purpose:
 * Gives students a small opportunity to USE a learned skill
 * before moving to an exam-style question.
 *
 * Learning flow:
 * CONCEPT
 *   ↓
 * EXAMPLE
 *   ↓
 * MICRO CHECK
 *   ↓
 * APPLICATION
 *   ↓
 * EXAM-STYLE QUESTION
 *
 * Application tasks are NOT official exam questions.
 */

const APPLICATION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  SELECT: "select",
  SHORT_ANSWER: "short_answer"
};

const APPLICATION_DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};


/**
 * Create a generic application task.
 */
function createApplication({
  id,
  type = APPLICATION_TYPES.MULTIPLE_CHOICE,
  prompt,
  options = [],
  correctAnswer,
  skill,
  conceptId = null,
  difficulty = APPLICATION_DIFFICULTIES.EASY,
  feedback = null
} = {}) {
  validateRequiredString(id, "id");
  validateRequiredString(prompt, "prompt");
  validateRequiredString(skill, "skill");

  if (!Object.values(APPLICATION_TYPES).includes(type)) {
    throw new Error(`Invalid application type: ${type}`);
  }

  if (
    !Object.values(APPLICATION_DIFFICULTIES).includes(
      difficulty
    )
  ) {
    throw new Error(
      `Invalid application difficulty: ${difficulty}`
    );
  }

  if (!Array.isArray(options)) {
    throw new Error("options must be an array.");
  }

  return {
    id,
    type,
    prompt,
    options,
    correctAnswer,
    skill,
    conceptId,
    difficulty,
    feedback
  };
}


/**
 * Create a multiple-choice application.
 */
function createMultipleChoiceApplication({
  id,
  prompt,
  options,
  correctAnswer,
  skill,
  conceptId = null,
  difficulty = APPLICATION_DIFFICULTIES.EASY,
  feedback = null
} = {}) {
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error(
      "Multiple-choice applications need at least 2 options."
    );
  }

  if (
    !Number.isInteger(correctAnswer) ||
    correctAnswer < 0 ||
    correctAnswer >= options.length
  ) {
    throw new Error(
      "correctAnswer must be a valid option index."
    );
  }

  return createApplication({
    id,
    type: APPLICATION_TYPES.MULTIPLE_CHOICE,
    prompt,
    options,
    correctAnswer,
    skill,
    conceptId,
    difficulty,
    feedback
  });
}


/**
 * Create a true/false application.
 */
function createTrueFalseApplication({
  id,
  prompt,
  correctAnswer,
  skill,
  conceptId = null,
  difficulty = APPLICATION_DIFFICULTIES.EASY,
  feedback = null
} = {}) {
  if (typeof correctAnswer !== "boolean") {
    throw new Error(
      "True/false correctAnswer must be boolean."
    );
  }

  return createApplication({
    id,
    type: APPLICATION_TYPES.TRUE_FALSE,
    prompt,
    options: ["True", "False"],
    correctAnswer,
    skill,
    conceptId,
    difficulty,
    feedback
  });
}


/**
 * Create a short-answer application.
 */
function createShortAnswerApplication({
  id,
  prompt,
  correctAnswer,
  skill,
  conceptId = null,
  difficulty = APPLICATION_DIFFICULTIES.MEDIUM,
  feedback = null
} = {}) {
  validateRequiredString(
    correctAnswer,
    "correctAnswer"
  );

  return createApplication({
    id,
    type: APPLICATION_TYPES.SHORT_ANSWER,
    prompt,
    options: [],
    correctAnswer,
    skill,
    conceptId,
    difficulty,
    feedback
  });
}


/**
 * Validate one application task.
 */
function validateApplication(application) {
  const errors = [];

  if (!application || typeof application !== "object") {
    return {
      valid: false,
      errors: ["Application must be an object."]
    };
  }

  if (!isNonEmptyString(application.id)) {
    errors.push("id is required.");
  }

  if (!isNonEmptyString(application.prompt)) {
    errors.push("prompt is required.");
  }

  if (
    !Object.values(APPLICATION_TYPES).includes(
      application.type
    )
  ) {
    errors.push("type is invalid.");
  }

  if (!isNonEmptyString(application.skill)) {
    errors.push("skill is required.");
  }

  if (
    !Object.values(APPLICATION_DIFFICULTIES).includes(
      application.difficulty
    )
  ) {
    errors.push("difficulty is invalid.");
  }

  if (!Array.isArray(application.options)) {
    errors.push("options must be an array.");
  }

  if (
    application.type ===
    APPLICATION_TYPES.MULTIPLE_CHOICE
  ) {
    if (application.options.length < 2) {
      errors.push(
        "Multiple-choice applications need at least 2 options."
      );
    }

    if (
      !Number.isInteger(application.correctAnswer) ||
      application.correctAnswer < 0 ||
      application.correctAnswer >=
        application.options.length
    ) {
      errors.push(
        "correctAnswer must be a valid option index."
      );
    }
  }

  if (
    application.type ===
    APPLICATION_TYPES.TRUE_FALSE
  ) {
    if (typeof application.correctAnswer !== "boolean") {
      errors.push(
        "True/false correctAnswer must be boolean."
      );
    }
  }

  if (
    application.type ===
    APPLICATION_TYPES.SHORT_ANSWER
  ) {
    if (!isNonEmptyString(application.correctAnswer)) {
      errors.push(
        "Short-answer correctAnswer is required."
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Validate a collection of applications.
 */
function validateApplications(applications) {
  if (!Array.isArray(applications)) {
    return {
      valid: false,
      errors: ["Applications must be an array."]
    };
  }

  const errors = [];

  applications.forEach((application, index) => {
    const result = validateApplication(application);

    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push(
          `Application ${index}: ${error}`
        );
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Find an application by ID.
 */
function getApplicationById(applications, id) {
  if (!Array.isArray(applications)) {
    return null;
  }

  return (
    applications.find(
      (application) => application.id === id
    ) || null
  );
}


/**
 * Get applications for a particular concept.
 */
function getApplicationsForConcept(
  applications,
  conceptId
) {
  if (!Array.isArray(applications)) {
    return [];
  }

  return applications.filter(
    (application) =>
      application.conceptId === conceptId
  );
}


/**
 * Get applications for a particular skill.
 */
function getApplicationsForSkill(
  applications,
  skill
) {
  if (!Array.isArray(applications)) {
    return [];
  }

  return applications.filter(
    (application) =>
      application.skill === skill
  );
}


/**
 * Evaluate the student's answer.
 */
function evaluateApplication(
  application,
  answer
) {
  if (!application) {
    return {
      correct: false,
      reason: "missing_application"
    };
  }

  if (
    application.type ===
    APPLICATION_TYPES.MULTIPLE_CHOICE
  ) {
    return {
      correct:
        answer === application.correctAnswer
    };
  }

  if (
    application.type ===
    APPLICATION_TYPES.TRUE_FALSE
  ) {
    return {
      correct:
        answer === application.correctAnswer
    };
  }

  if (
    application.type ===
    APPLICATION_TYPES.SHORT_ANSWER
  ) {
    if (
      typeof answer !== "string" ||
      typeof application.correctAnswer !== "string"
    ) {
      return {
        correct: false
      };
    }

    return {
      correct:
        normalizeAnswer(answer) ===
        normalizeAnswer(
          application.correctAnswer
        )
    };
  }

  return {
    correct: false,
    reason: "unsupported_type"
  };
}


/**
 * Get student-facing feedback.
 */
function getApplicationFeedback(
  application,
  result
) {
  if (!result || !result.correct) {
    return {
      title: "❌ NOT QUITE",
      message:
        application &&
        application.feedback &&
        application.feedback.incorrect
          ? application.feedback.incorrect
          : "You're close. Think about the skill you just learned."
    };
  }

  return {
    title: "✅ NICE WORK!",
    message:
      application &&
      application.feedback &&
      application.feedback.correct
        ? application.feedback.correct
        : "You used the idea correctly. Keep going!"
  };
}


/**
 * Get the skill label for an application.
 */
function getApplicationSkill(application) {
  if (!application) {
    return null;
  }

  return application.skill;
}


/**
 * Get the difficulty.
 */
function getApplicationDifficulty(application) {
  if (!application) {
    return null;
  }

  return application.difficulty;
}


/**
 * Normalize simple short answers.
 */
function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/**
 * Internal validation helper.
 */
function validateRequiredString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    throw new Error(
      `${fieldName} must be a non-empty string.`
    );
  }
}


/**
 * Internal string helper.
 */
function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


module.exports = {
  APPLICATION_TYPES,
  APPLICATION_DIFFICULTIES,

  createApplication,
  createMultipleChoiceApplication,
  createTrueFalseApplication,
  createShortAnswerApplication,

  validateApplication,
  validateApplications,

  getApplicationById,
  getApplicationsForConcept,
  getApplicationsForSkill,

  evaluateApplication,
  getApplicationFeedback,

  getApplicationSkill,
  getApplicationDifficulty
};
