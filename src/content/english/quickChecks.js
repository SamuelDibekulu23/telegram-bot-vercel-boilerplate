/**
 * FineBot English Quick Check Engine
 *
 * Purpose:
 * Provides small concept-level checks inside lessons.
 *
 * Quick checks are different from:
 * - the main Practice question bank
 * - exact previous exam questions
 * - full lesson assessments
 *
 * Their job is simple:
 * "Did the student understand this idea?"
 */

const QUICK_CHECK_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  SHORT_ANSWER: "short_answer"
};

const QUICK_CHECK_DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};


/**
 * Create a generic quick check.
 */
function createQuickCheck({
  id,
  type = QUICK_CHECK_TYPES.MULTIPLE_CHOICE,
  question,
  options = [],
  correctAnswer,
  explanation = null,
  difficulty = QUICK_CHECK_DIFFICULTIES.EASY,
  conceptId = null
} = {}) {
  validateRequiredString(id, "id");
  validateRequiredString(question, "question");

  if (!Object.values(QUICK_CHECK_TYPES).includes(type)) {
    throw new Error(`Invalid quick check type: ${type}`);
  }

  if (
    !Object.values(QUICK_CHECK_DIFFICULTIES).includes(
      difficulty
    )
  ) {
    throw new Error(
      `Invalid quick check difficulty: ${difficulty}`
    );
  }

  if (!Array.isArray(options)) {
    throw new Error("options must be an array.");
  }

  return {
    id,
    type,
    question,
    options,
    correctAnswer,
    explanation,
    difficulty,
    conceptId
  };
}


/**
 * Create a multiple-choice quick check.
 */
function createMultipleChoiceCheck({
  id,
  question,
  options,
  correctAnswer,
  explanation = null,
  difficulty = QUICK_CHECK_DIFFICULTIES.EASY,
  conceptId = null
} = {}) {
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error(
      "Multiple-choice checks need at least 2 options."
    );
  }

  return createQuickCheck({
    id,
    type: QUICK_CHECK_TYPES.MULTIPLE_CHOICE,
    question,
    options,
    correctAnswer,
    explanation,
    difficulty,
    conceptId
  });
}


/**
 * Create a true/false quick check.
 */
function createTrueFalseCheck({
  id,
  question,
  correctAnswer,
  explanation = null,
  difficulty = QUICK_CHECK_DIFFICULTIES.EASY,
  conceptId = null
} = {}) {
  if (
    typeof correctAnswer !== "boolean"
  ) {
    throw new Error(
      "True/false correctAnswer must be boolean."
    );
  }

  return createQuickCheck({
    id,
    type: QUICK_CHECK_TYPES.TRUE_FALSE,
    question,
    options: ["True", "False"],
    correctAnswer,
    explanation,
    difficulty,
    conceptId
  });
}


/**
 * Create a short-answer quick check.
 */
function createShortAnswerCheck({
  id,
  question,
  correctAnswer,
  explanation = null,
  difficulty = QUICK_CHECK_DIFFICULTIES.MEDIUM,
  conceptId = null
} = {}) {
  validateRequiredString(
    correctAnswer,
    "correctAnswer"
  );

  return createQuickCheck({
    id,
    type: QUICK_CHECK_TYPES.SHORT_ANSWER,
    question,
    options: [],
    correctAnswer,
    explanation,
    difficulty,
    conceptId
  });
}


/**
 * Validate one quick check.
 */
function validateQuickCheck(check) {
  const errors = [];

  if (!check || typeof check !== "object") {
    return {
      valid: false,
      errors: ["Quick check must be an object."]
    };
  }

  if (!isNonEmptyString(check.id)) {
    errors.push("id is required.");
  }

  if (!isNonEmptyString(check.question)) {
    errors.push("question is required.");
  }

  if (
    !Object.values(QUICK_CHECK_TYPES).includes(
      check.type
    )
  ) {
    errors.push("type is invalid.");
  }

  if (
    !Object.values(QUICK_CHECK_DIFFICULTIES).includes(
      check.difficulty
    )
  ) {
    errors.push("difficulty is invalid.");
  }

  if (!Array.isArray(check.options)) {
    errors.push("options must be an array.");
  }

  if (check.type === QUICK_CHECK_TYPES.MULTIPLE_CHOICE) {
    if (check.options.length < 2) {
      errors.push(
        "Multiple-choice checks need at least 2 options."
      );
    }

    if (
      !Number.isInteger(check.correctAnswer) ||
      check.correctAnswer < 0 ||
      check.correctAnswer >= check.options.length
    ) {
      errors.push(
        "Multiple-choice correctAnswer must be a valid option index."
      );
    }
  }

  if (check.type === QUICK_CHECK_TYPES.TRUE_FALSE) {
    if (typeof check.correctAnswer !== "boolean") {
      errors.push(
        "True/false correctAnswer must be boolean."
      );
    }
  }

  if (check.type === QUICK_CHECK_TYPES.SHORT_ANSWER) {
    if (!isNonEmptyString(check.correctAnswer)) {
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
 * Validate a collection of quick checks.
 */
function validateQuickChecks(checks) {
  if (!Array.isArray(checks)) {
    return {
      valid: false,
      errors: ["Quick checks must be an array."]
    };
  }

  const errors = [];

  checks.forEach((check, index) => {
    const result = validateQuickCheck(check);

    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push(`Check ${index}: ${error}`);
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Find a quick check by ID.
 */
function getQuickCheckById(checks, id) {
  if (!Array.isArray(checks)) {
    return null;
  }

  return (
    checks.find((check) => check.id === id) ||
    null
  );
}


/**
 * Get checks belonging to a specific concept.
 */
function getChecksForConcept(checks, conceptId) {
  if (!Array.isArray(checks)) {
    return [];
  }

  return checks.filter(
    (check) => check.conceptId === conceptId
  );
}


/**
 * Check a student's answer.
 *
 * This performs simple evaluation only.
 * The UI decides how the result is presented.
 */
function evaluateQuickCheck(check, answer) {
  if (!check) {
    return {
      correct: false,
      reason: "missing_check"
    };
  }

  if (check.type === QUICK_CHECK_TYPES.MULTIPLE_CHOICE) {
    return {
      correct: answer === check.correctAnswer
    };
  }

  if (check.type === QUICK_CHECK_TYPES.TRUE_FALSE) {
    return {
      correct: answer === check.correctAnswer
    };
  }

  if (check.type === QUICK_CHECK_TYPES.SHORT_ANSWER) {
    if (
      typeof answer !== "string" ||
      typeof check.correctAnswer !== "string"
    ) {
      return {
        correct: false
      };
    }

    return {
      correct:
        normalizeAnswer(answer) ===
        normalizeAnswer(check.correctAnswer)
    };
  }

  return {
    correct: false,
    reason: "unsupported_type"
  };
}


/**
 * Return feedback after evaluation.
 */
function getQuickCheckFeedback(check, result) {
  if (!result || !result.correct) {
    return {
      title: "❌ NOT QUITE",
      message:
        "That's okay. Let's look at the idea again."
    };
  }

  return {
    title: "✅ NICE!",
    message:
      "You've got the idea. Let's keep moving."
  };
}


/**
 * Get the explanation only when the lesson
 * explicitly provides one.
 */
function getQuickCheckExplanation(check) {
  if (!check || !check.explanation) {
    return null;
  }

  return check.explanation;
}


/**
 * Normalize simple short answers.
 *
 * This is intentionally conservative.
 * It does not attempt to judge complex language answers.
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
  QUICK_CHECK_TYPES,
  QUICK_CHECK_DIFFICULTIES,

  createQuickCheck,
  createMultipleChoiceCheck,
  createTrueFalseCheck,
  createShortAnswerCheck,

  validateQuickCheck,
  validateQuickChecks,

  getQuickCheckById,
  getChecksForConcept,

  evaluateQuickCheck,
  getQuickCheckFeedback,
  getQuickCheckExplanation
};
