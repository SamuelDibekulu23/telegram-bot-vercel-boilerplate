 /**
 * FineBot English Lesson Content Contract
 *
 * Purpose:
 * Defines the structure every real English lesson
 * must follow.
 *
 * This file does NOT contain the 46 lesson contents.
 * It defines how those lessons will be represented.
 *
 * Academic content remains separate from:
 * - presentation templates
 * - progression
 * - rewards
 * - Telegram UI
 */

const CONTENT_TYPES = {
  INTRO: "intro",
  CONCEPT: "concept",
  EXAMPLE: "example",
  MICRO_CHECK: "micro_check",
  EXAM_CONNECTION: "exam_connection",
  COMPLETION: "completion"
};

const NOTE_STYLES = {
  RULE_CARD: "rule_card",
  MEMORY_TRICK: "memory_trick",
  TRAP_CARD: "trap_card",
  LOOK_CLOSER: "look_closer",
  BUILD_IT: "build_it",
  FUNNY_NOTE: "funny_note",
  REAL_LIFE: "real_life",
  EXAM_LENS: "exam_lens"
};


/**
 * Create a basic lesson content object.
 *
 * The actual academic text will be added later
 * from verified source material.
 */
function createLessonContent({
  lessonId,
  title,
  category,
  skillId,
  difficulty = "medium",
  templateId = null,
  intro = null,
  concepts = [],
  examConnection = null,
  completion = null
} = {}) {
  validateRequiredString(lessonId, "lessonId");
  validateRequiredString(title, "title");
  validateRequiredString(category, "category");
  validateRequiredString(skillId, "skillId");

  if (!Array.isArray(concepts)) {
    throw new Error("concepts must be an array.");
  }

  return {
    lessonId,
    title,
    category,
    skillId,
    difficulty,
    templateId,

    intro,

    concepts,

    examConnection,

    completion
  };
}


/**
 * Create one lesson concept.
 *
 * A concept is the smallest meaningful teaching unit
 * inside a FineBot lesson.
 */
function createConcept({
  id,
  title,
  explanation,
  noteStyle = NOTE_STYLES.RULE_CARD,
  note = null,
  analogy = null,
  example = null,
  microCheck = null,
  examConnection = null
} = {}) {
  validateRequiredString(id, "concept.id");
  validateRequiredString(title, "concept.title");
  validateRequiredString(
    explanation,
    "concept.explanation"
  );

  return {
    type: CONTENT_TYPES.CONCEPT,

    id,
    title,
    explanation,

    noteStyle,
    note,

    analogy,
    example,

    microCheck,

    examConnection
  };
}


/**
 * Create an example attached to a concept.
 *
 * Examples explain the idea without replacing
 * the academic concept itself.
 */
function createExample({
  prompt,
  answer = null,
  explanation = null,
  realWorld = false
} = {}) {
  validateRequiredString(prompt, "example.prompt");

  return {
    type: CONTENT_TYPES.EXAMPLE,

    prompt,
    answer,
    explanation,
    realWorld
  };
}


/**
 * Create a small confidence-building check.
 *
 * This is NOT necessarily an official exam question.
 * It is a learning check before the student moves on.
 */
function createMicroCheck({
  question,
  options = [],
  correctAnswer = null,
  feedback = null
} = {}) {
  validateRequiredString(
    question,
    "microCheck.question"
  );

  if (!Array.isArray(options)) {
    throw new Error("microCheck.options must be an array.");
  }

  return {
    type: CONTENT_TYPES.MICRO_CHECK,

    question,
    options,
    correctAnswer,
    feedback
  };
}


/**
 * Create the exam connection for a concept or lesson.
 *
 * This explains what skill the student should recognize
 * when facing exam material.
 */
function createExamConnection({
  skill,
  examTip = null,
  commonTrap = null,
  sourceNote = null
} = {}) {
  validateRequiredString(skill, "examConnection.skill");

  return {
    type: CONTENT_TYPES.EXAM_CONNECTION,

    skill,
    examTip,
    commonTrap,
    sourceNote
  };
}


/**
 * Create lesson introduction content.
 */
function createIntroduction({
  hook,
  goal,
  quickStart = null
} = {}) {
  validateRequiredString(hook, "intro.hook");
  validateRequiredString(goal, "intro.goal");

  return {
    type: CONTENT_TYPES.INTRO,

    hook,
    goal,
    quickStart
  };
}


/**
 * Create lesson completion content.
 */
function createCompletion({
  message,
  nextStep = null,
  takeaway = null
} = {}) {
  validateRequiredString(
    message,
    "completion.message"
  );

  return {
    type: CONTENT_TYPES.COMPLETION,

    message,
    nextStep,
    takeaway
  };
}


/**
 * Validate a complete lesson.
 *
 * This protects the content engine from malformed
 * lesson definitions before they reach the student.
 */
function validateLessonContent(lesson) {
  const errors = [];

  if (!lesson || typeof lesson !== "object") {
    return {
      valid: false,
      errors: ["Lesson must be an object."]
    };
  }

  if (!isNonEmptyString(lesson.lessonId)) {
    errors.push("lessonId is required.");
  }

  if (!isNonEmptyString(lesson.title)) {
    errors.push("title is required.");
  }

  if (!isNonEmptyString(lesson.category)) {
    errors.push("category is required.");
  }

  if (!isNonEmptyString(lesson.skillId)) {
    errors.push("skillId is required.");
  }

  if (!Array.isArray(lesson.concepts)) {
    errors.push("concepts must be an array.");
  } else if (lesson.concepts.length === 0) {
    errors.push(
      "A lesson must contain at least one concept."
    );
  } else {
    lesson.concepts.forEach((concept, index) => {
      const prefix = `concepts[${index}]`;

      if (!concept || typeof concept !== "object") {
        errors.push(`${prefix} must be an object.`);
        return;
      }

      if (!isNonEmptyString(concept.id)) {
        errors.push(`${prefix}.id is required.`);
      }

      if (!isNonEmptyString(concept.title)) {
        errors.push(`${prefix}.title is required.`);
      }

      if (!isNonEmptyString(concept.explanation)) {
        errors.push(
          `${prefix}.explanation is required.`
        );
      }

      if (
        concept.noteStyle &&
        !Object.values(NOTE_STYLES).includes(
          concept.noteStyle
        )
      ) {
        errors.push(
          `${prefix}.noteStyle is invalid.`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Validate multiple lessons.
 */
function validateLessonCollection(lessons) {
  if (!Array.isArray(lessons)) {
    return {
      valid: false,
      errors: ["Lessons must be an array."]
    };
  }

  const errors = [];

  lessons.forEach((lesson, index) => {
    const result = validateLessonContent(lesson);

    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push(`Lesson ${index}: ${error}`);
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Return the number of actual teaching concepts
 * inside a lesson.
 */
function getConceptCount(lesson) {
  if (
    !lesson ||
    !Array.isArray(lesson.concepts)
  ) {
    return 0;
  }

  return lesson.concepts.length;
}


/**
 * Get a specific concept by ID.
 */
function getConceptById(lesson, conceptId) {
  if (
    !lesson ||
    !Array.isArray(lesson.concepts)
  ) {
    return null;
  }

  return (
    lesson.concepts.find(
      (concept) => concept.id === conceptId
    ) || null
  );
}


/**
 * Get a concept by its position.
 *
 * Position is zero-based internally.
 */
function getConceptByIndex(lesson, index) {
  if (
    !lesson ||
    !Array.isArray(lesson.concepts) ||
    !Number.isInteger(index) ||
    index < 0
  ) {
    return null;
  }

  return lesson.concepts[index] || null;
}


/**
 * Return all available note styles.
 */
function getNoteStyles() {
  return Object.values(NOTE_STYLES);
}


/**
 * Small reusable validation helpers.
 */
function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


function validateRequiredString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    throw new Error(
      `${fieldName} must be a non-empty string.`
    );
  }
}


module.exports = {
  CONTENT_TYPES,
  NOTE_STYLES,

  createLessonContent,
  createConcept,
  createExample,
  createMicroCheck,
  createExamConnection,
  createIntroduction,
  createCompletion,

  validateLessonContent,
  validateLessonCollection,

  getConceptCount,
  getConceptById,
  getConceptByIndex,
  getNoteStyles
};
