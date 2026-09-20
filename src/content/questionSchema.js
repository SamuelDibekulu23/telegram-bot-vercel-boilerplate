const ALLOWED_STREAMS = ["Natural", "Social"];

const ALLOWED_SOURCE_TYPES = [
  "exact_exam_paper",
  "original_finebot",
];

const ALLOWED_DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
];

const ALLOWED_QUESTION_TYPES = [
  "multiple_choice",
];

const ALLOWED_EXAM_SKILLS = [
  "recall",
  "concept-understanding",
  "application",
  "analysis",
  "problem-solving",
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidQuestion(question) {
  if (!question || typeof question !== "object") {
    return false;
  }

  if (!isNonEmptyString(question.id)) {
    return false;
  }

  if (!ALLOWED_STREAMS.includes(question.stream)) {
    return false;
  }

  if (!isNonEmptyString(question.subject)) {
    return false;
  }

  if (!isNonEmptyString(question.unit)) {
    return false;
  }

  if (!isNonEmptyString(question.topic)) {
    return false;
  }

  if (!ALLOWED_DIFFICULTIES.includes(question.difficulty)) {
    return false;
  }

  if (!ALLOWED_QUESTION_TYPES.includes(question.questionType)) {
    return false;
  }

  if (!isNonEmptyString(question.question)) {
    return false;
  }

  if (!Array.isArray(question.options)) {
    return false;
  }

  if (question.options.length !== 4) {
    return false;
  }

  if (!question.options.every(isNonEmptyString)) {
    return false;
  }

  if (
    !Number.isInteger(question.correctAnswer) ||
    question.correctAnswer < 0 ||
    question.correctAnswer > 3
  ) {
    return false;
  }

  if (!isNonEmptyString(question.explanation)) {
    return false;
  }

  if (!ALLOWED_EXAM_SKILLS.includes(question.examSkill)) {
    return false;
  }

  if (!ALLOWED_SOURCE_TYPES.includes(question.sourceType)) {
    return false;
  }

  /*
   * Exact previous exam questions require
   * complete provenance and verification.
   */
  if (question.sourceType === "exact_exam_paper") {
    if (!Number.isInteger(question.examYear)) {
      return false;
    }

    if (!isNonEmptyString(question.paperName)) {
      return false;
    }

    if (!Number.isInteger(question.questionNumber)) {
      return false;
    }

    if (!isNonEmptyString(question.sourceReference)) {
      return false;
    }

    if (question.verified !== true) {
      return false;
    }
  }

  /*
   * FineBot-original questions must never
   * be presented as verified exam questions.
   */
  if (question.sourceType === "original_finebot") {
    if (question.verified === true) {
      return false;
    }
  }

  return true;
}

function getSourceLabel(question) {
  if (
    question &&
    question.sourceType === "exact_exam_paper" &&
    question.verified === true
  ) {
    return "📄 EXACT PREVIOUS EXAM PAPER QUESTION";
  }

  if (
    question &&
    question.sourceType === "original_finebot"
  ) {
    return "🧠 FINEBOT ORIGINAL PRACTICE QUESTION";
  }

  return "⚠️ SOURCE NOT VERIFIED";
}

function getSourceInfo(question) {
  if (!question) {
    return null;
  }

  if (question.sourceType === "exact_exam_paper") {
    return {
      type: "exact_exam_paper",
      label: getSourceLabel(question),
      examYear: question.examYear || null,
      paperName: question.paperName || null,
      questionNumber: question.questionNumber || null,
      sourceReference: question.sourceReference || null,
      verified: question.verified === true,
    };
  }

  return {
    type: question.sourceType || null,
    label: getSourceLabel(question),
    verified: question.verified === true,
  };
}

module.exports = {
  ALLOWED_STREAMS,
  ALLOWED_SOURCE_TYPES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_QUESTION_TYPES,
  ALLOWED_EXAM_SKILLS,
  isValidQuestion,
  getSourceLabel,
  getSourceInfo,
};
