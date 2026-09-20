/**
 * FineBot English Lesson Builder
 *
 * Purpose:
 * Converts prepared lesson components into one
 * complete, structured lesson.
 *
 * Brick 22:
 *
 * The builder now understands the complete FineBot
 * learning flow:
 *
 * Introduction
 *      ↓
 * Concept
 *      ↓
 * Note
 *      ↓
 * Example
 *      ↓
 * Micro Check
 *      ↓
 * Application
 *      ↓
 * Exam Connection
 *      ↓
 * Final Stretch
 *      ↓
 * Completion
 *
 * This module does NOT create academic content.
 * It only assembles content that already exists.
 */


/**
 * Supported lesson section types.
 */
const LESSON_SECTION_TYPES = {
  INTRODUCTION: "introduction",
  CONCEPT: "concept",
  NOTE: "note",
  EXAMPLE: "example",
  QUICK_CHECK: "quick_check",
  APPLICATION: "application",
  EXAM_CONNECTION: "exam_connection",
  FINAL_STRETCH: "final_stretch",
  COMPLETION: "completion"
};


/**
 * Create a complete lesson object.
 */
function createLesson({
  id,
  title,
  category,
  skill,
  difficulty = "medium",
  sections = [],
  metadata = {}
} = {}) {
  validateRequiredString(id, "lesson.id");
  validateRequiredString(title, "lesson.title");
  validateRequiredString(category, "lesson.category");
  validateRequiredString(skill, "lesson.skill");

  if (!Array.isArray(sections)) {
    throw new Error(
      "lesson.sections must be an array."
    );
  }

  return {
    id,
    title,
    category,
    skill,
    difficulty,
    sections,
    metadata
  };
}


/**
 * Create one lesson section.
 */
function createSection({
  type,
  content,
  id = null,
  conceptId = null,
  metadata = {}
} = {}) {
  if (
    !Object.values(
      LESSON_SECTION_TYPES
    ).includes(type)
  ) {
    throw new Error(
      "Invalid lesson section type: " +
        type
    );
  }

  if (
    content === undefined ||
    content === null
  ) {
    throw new Error(
      "Section content is required."
    );
  }

  return {
    type,
    id,
    conceptId,
    content,
    metadata
  };
}


/**
 * Add one section to a lesson.
 */
function addSection(
  lesson,
  section
) {
  if (
    !lesson ||
    typeof lesson !== "object"
  ) {
    throw new Error(
      "A valid lesson is required."
    );
  }

  if (
    !Array.isArray(
      lesson.sections
    )
  ) {
    lesson.sections = [];
  }

  lesson.sections.push(
    section
  );

  return lesson;
}


/**
 * Add multiple sections to a lesson.
 */
function addSections(
  lesson,
  sections = []
) {
  if (!Array.isArray(sections)) {
    throw new Error(
      "sections must be an array."
    );
  }

  sections.forEach(
    (section) => {
      addSection(
        lesson,
        section
      );
    }
  );

  return lesson;
}


/**
 * Build a complete lesson from prepared
 * lessonContent components.
 *
 * This is the main bridge between:
 *
 * lessonContent format
 *        ↓
 * lessonBuilder format
 */
function buildLesson({
  id,
  title,
  category,
  skill,
  difficulty = "medium",
  introduction = null,
  concepts = [],
  notes = [],
  examples = [],
  quickChecks = [],
  applications = [],
  examConnections = [],
  finalStretch = null,
  completion = null,
  metadata = {}
} = {}) {
  const lesson =
    createLesson({
      id,
      title,
      category,
      skill,
      difficulty,
      metadata
    });


  /**
   * Introduction
   */
  if (introduction) {
    addSection(
      lesson,
      createSection({
        type:
          LESSON_SECTION_TYPES.INTRODUCTION,
        content:
          introduction
      })
    );
  }


  /**
   * Concepts
   *
   * A concept may contain its own:
   * - note
   * - example
   * - microCheck
   *
   * Brick 22 extracts those nested pieces
   * into proper lesson sections.
   */
  if (Array.isArray(concepts)) {
    concepts.forEach(
      (concept) => {
        if (!concept) {
          return;
        }

        const conceptId =
          concept.id || null;


        /**
         * Main concept section
         */
        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.CONCEPT,
            id:
              concept.id || null,
            conceptId,
            content:
              concept
          })
        );


        /**
         * Nested note
         */
        if (concept.note) {
          const noteId =
            conceptId
              ? conceptId + "-note"
              : null;

          addSection(
            lesson,
            createSection({
              type:
                LESSON_SECTION_TYPES.NOTE,
              id: noteId,
              conceptId,
              content:
                concept.note
            })
          );
        }


        /**
         * Nested example
         */
        if (concept.example) {
          const exampleId =
            conceptId
              ? conceptId + "-example"
              : null;

          addSection(
            lesson,
            createSection({
              type:
                LESSON_SECTION_TYPES.EXAMPLE,
              id: exampleId,
              conceptId,
              content:
                concept.example
            })
          );
        }


        /**
         * Nested micro-check
         */
        if (concept.microCheck) {
          const checkId =
            conceptId
              ? conceptId + "-micro-check"
              : null;

          addSection(
            lesson,
            createSection({
              type:
                LESSON_SECTION_TYPES.QUICK_CHECK,
              id: checkId,
              conceptId,
              content:
                concept.microCheck
            })
          );
        }


        /**
         * Nested exam connection
         *
         * This is only used when actual lesson
         * content contains an exam connection.
         */
        if (concept.examConnection) {
          const examId =
            conceptId
              ? conceptId + "-exam"
              : null;

          addSection(
            lesson,
            createSection({
              type:
                LESSON_SECTION_TYPES.EXAM_CONNECTION,
              id: examId,
              conceptId,
              content:
                concept.examConnection
            })
          );
        }
      }
    );
  }


  /**
   * Additional standalone notes.
   *
   * Supported for future lessons without
   * changing the existing concept format.
   */
  if (Array.isArray(notes)) {
    notes.forEach(
      (note, index) => {
        if (!note) {
          return;
        }

        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.NOTE,
            id:
              note.id ||
              "note-" +
                (index + 1),
            conceptId:
              note.conceptId ||
              null,
            content:
              note
          })
        );
      }
    );
  }


  /**
   * Additional standalone examples.
   */
  if (Array.isArray(examples)) {
    examples.forEach(
      (example, index) => {
        if (!example) {
          return;
        }

        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.EXAMPLE,
            id:
              example.id ||
              "example-" +
                (index + 1),
            conceptId:
              example.conceptId ||
              null,
            content:
              example
          })
        );
      }
    );
  }


  /**
   * Additional standalone quick checks.
   */
  if (Array.isArray(quickChecks)) {
    quickChecks.forEach(
      (check, index) => {
        if (!check) {
          return;
        }

        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.QUICK_CHECK,
            id:
              check.id ||
              "quick-check-" +
                (index + 1),
            conceptId:
              check.conceptId ||
              null,
            content:
              check
          })
        );
      }
    );
  }


  /**
   * Applications
   */
  if (Array.isArray(applications)) {
    applications.forEach(
      (application) => {
        if (!application) {
          return;
        }

        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.APPLICATION,
            id:
              application.id ||
              null,
            conceptId:
              application.conceptId ||
              null,
            content:
              application
          })
        );
      }
    );
  }


  /**
   * Authentic exam connections.
   *
   * Never manufacture exam questions here.
   */
  if (
    Array.isArray(
      examConnections
    )
  ) {
    examConnections.forEach(
      (connection) => {
        if (!connection) {
          return;
        }

        addSection(
          lesson,
          createSection({
            type:
              LESSON_SECTION_TYPES.EXAM_CONNECTION,
            id:
              connection.id ||
              null,
            conceptId:
              connection.conceptId ||
              null,
            content:
              connection
          })
        );
      }
    );
  }


  /**
   * Final Stretch
   */
  if (finalStretch) {
    addSection(
      lesson,
      createSection({
        type:
          LESSON_SECTION_TYPES.FINAL_STRETCH,
        id:
          "final-stretch",
        conceptId: null,
        content:
          finalStretch
      })
    );
  }


  /**
   * Completion
   */
  if (completion) {
    addSection(
      lesson,
      createSection({
        type:
          LESSON_SECTION_TYPES.COMPLETION,
        content:
          completion
      })
    );
  }

  return lesson;
}


/**
 * Get all sections of one type.
 */
function getSectionsByType(
  lesson,
  type
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return [];
  }

  return lesson.sections.filter(
    (section) =>
      section.type === type
  );
}


/**
 * Get the first section of one type.
 */
function getFirstSectionByType(
  lesson,
  type
) {
  const sections =
    getSectionsByType(
      lesson,
      type
    );

  return sections.length > 0
    ? sections[0]
    : null;
}


/**
 * Get all sections belonging to one concept.
 */
function getSectionsForConcept(
  lesson,
  conceptId
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return [];
  }

  return lesson.sections.filter(
    (section) =>
      section.conceptId ===
      conceptId
  );
}


/**
 * Validate a complete lesson.
 */
function validateLesson(
  lesson
) {
  const errors = [];

  if (
    !lesson ||
    typeof lesson !== "object"
  ) {
    return {
      valid: false,
      errors: [
        "Lesson must be an object."
      ]
    };
  }

  if (
    !isNonEmptyString(
      lesson.id
    )
  ) {
    errors.push(
      "id is required."
    );
  }

  if (
    !isNonEmptyString(
      lesson.title
    )
  ) {
    errors.push(
      "title is required."
    );
  }

  if (
    !isNonEmptyString(
      lesson.category
    )
  ) {
    errors.push(
      "category is required."
    );
  }

  if (
    !isNonEmptyString(
      lesson.skill
    )
  ) {
    errors.push(
      "skill is required."
    );
  }

  if (
    !Array.isArray(
      lesson.sections
    )
  ) {
    errors.push(
      "sections must be an array."
    );
  }

  if (
    Array.isArray(
      lesson.sections
    )
  ) {
    lesson.sections.forEach(
      (section, index) => {
        const result =
          validateSection(
            section
          );

        result.errors.forEach(
          (error) => {
            errors.push(
              "Section " +
                index +
                ": " +
                error
            );
          }
        );
      }
    );
  }

  return {
    valid:
      errors.length === 0,
    errors
  };
}


/**
 * Validate one lesson section.
 */
function validateSection(
  section
) {
  const errors = [];

  if (
    !section ||
    typeof section !== "object"
  ) {
    return {
      valid: false,
      errors: [
        "Section must be an object."
      ]
    };
  }

  if (
    !Object.values(
      LESSON_SECTION_TYPES
    ).includes(
      section.type
    )
  ) {
    errors.push(
      "Invalid section type."
    );
  }

  if (
    section.content === undefined ||
    section.content === null
  ) {
    errors.push(
      "Section content is required."
    );
  }

  return {
    valid:
      errors.length === 0,
    errors
  };
}


/**
 * Count lesson sections.
 */
function getSectionCount(
  lesson
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return 0;
  }

  return lesson.sections.length;
}


/**
 * Create a compact lesson summary.
 */
function getLessonSummary(
  lesson
) {
  if (!lesson) {
    return null;
  }

  const sections =
    Array.isArray(
      lesson.sections
    )
      ? lesson.sections
      : [];

  return {
    id: lesson.id,
    title: lesson.title,
    category:
      lesson.category,
    skill: lesson.skill,
    difficulty:
      lesson.difficulty,
    sectionCount:
      sections.length,
    concepts:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.CONCEPT
      ).length,
    notes:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.NOTE
      ).length,
    examples:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.EXAMPLE
      ).length,
    quickChecks:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.QUICK_CHECK
      ).length,
    applications:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.APPLICATION
      ).length,
    examConnections:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.EXAM_CONNECTION
      ).length,
    finalStretch:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.FINAL_STRETCH
      ).length,
    completion:
      getSectionsByType(
        lesson,
        LESSON_SECTION_TYPES.COMPLETION
      ).length
  };
}


/**
 * Check whether a lesson has an exam connection.
 */
function hasExamConnection(
  lesson
) {
  return (
    getSectionsByType(
      lesson,
      LESSON_SECTION_TYPES.EXAM_CONNECTION
    ).length > 0
  );
}


/**
 * Check whether a lesson has concepts.
 */
function hasConcept(
  lesson
) {
  return (
    getSectionsByType(
      lesson,
      LESSON_SECTION_TYPES.CONCEPT
    ).length > 0
  );
}


/**
 * Return the intended learning sequence.
 */
function getLearningSequence(
  lesson
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return [];
  }

  return lesson.sections.map(
    (section) => ({
      type:
        section.type,
      id:
        section.id,
      conceptId:
        section.conceptId
    })
  );
}


/**
 * Internal validation helper.
 */
function validateRequiredString(
  value,
  field
) {
  if (
    !isNonEmptyString(value)
  ) {
    throw new Error(
      field +
        " is required."
    );
  }
}


/**
 * Internal string helper.
 */
function isNonEmptyString(
  value
) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


/**
 * Public API
 */
module.exports = {
  LESSON_SECTION_TYPES,

  createLesson,
  createSection,

  addSection,
  addSections,

  buildLesson,

  getSectionsByType,
  getFirstSectionByType,
  getSectionsForConcept,

  validateLesson,
  validateSection,

  getSectionCount,
  getLessonSummary,

  hasExamConnection,
  hasConcept,

  getLearningSequence
};
