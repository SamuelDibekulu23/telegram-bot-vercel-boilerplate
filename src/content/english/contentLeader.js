/**
 * FineBot English Content Loader
 *
 * Purpose:
 * Loads prepared lesson content for a registered
 * English lesson.
 *
 * This module does NOT create academic content.
 *
 * It connects:
 *
 * Content Registry
 *       ↓
 * Content Loader
 *       ↓
 * Lesson Builder
 *       ↓
 * Lesson Validator
 *
 * Brick 22:
 *
 * Prepared lesson content can now be converted
 * into the complete Lesson Builder structure,
 * including:
 *
 * - Introduction
 * - Concepts
 * - Notes
 * - Examples
 * - Micro Checks
 * - Applications
 * - Authentic Exam Connections
 * - Final Stretch
 * - Completion
 */


/**
 * Create a content store.
 */
function createContentStore(
  contents = []
) {
  if (
    !Array.isArray(contents) &&
    !isPlainObject(contents)
  ) {
    throw new Error(
      "Content store must be an array or object."
    );
  }

  const store = new Map();

  if (Array.isArray(contents)) {
    contents.forEach(
      (content) => {
        registerContent(
          store,
          content
        );
      }
    );
  } else {
    Object.keys(contents).forEach(
      (lessonId) => {
        registerContent(
          store,
          {
            lessonId,
            content:
              contents[lessonId]
          }
        );
      }
    );
  }

  return store;
}


/**
 * Register prepared content for one lesson.
 */
function registerContent(
  store,
  entry
) {
  if (!(store instanceof Map)) {
    throw new Error(
      "Content store must be a Map."
    );
  }

  if (
    !entry ||
    typeof entry !== "object"
  ) {
    throw new Error(
      "Content entry must be an object."
    );
  }

  const lessonId =
    entry.lessonId;

  if (
    !isNonEmptyString(lessonId)
  ) {
    throw new Error(
      "lessonId is required."
    );
  }

  if (
    entry.content === undefined ||
    entry.content === null
  ) {
    throw new Error(
      "Content is required for lesson: " +
        lessonId
    );
  }

  if (store.has(lessonId)) {
    throw new Error(
      "Duplicate content for lesson: " +
        lessonId
    );
  }

  store.set(
    lessonId,
    entry.content
  );

  return entry.content;
}


/**
 * Check whether content exists for a lesson.
 */
function hasContent(
  store,
  lessonId
) {
  return (
    store instanceof Map &&
    isNonEmptyString(lessonId) &&
    store.has(lessonId)
  );
}


/**
 * Load content for a lesson.
 */
function loadContent(
  store,
  lessonId
) {
  if (!(store instanceof Map)) {
    return null;
  }

  if (
    !isNonEmptyString(lessonId)
  ) {
    return null;
  }

  return (
    store.get(lessonId) ||
    null
  );
}


/**
 * Load content while requiring the lesson
 * to exist in the lesson registry.
 */
function loadRegisteredContent(
  registry,
  store,
  lessonId
) {
  if (
    !registry ||
    typeof registry.get !== "function"
  ) {
    throw new Error(
      "A valid lesson registry is required."
    );
  }

  if (!(store instanceof Map)) {
    throw new Error(
      "A valid content store is required."
    );
  }

  if (
    !isNonEmptyString(lessonId)
  ) {
    throw new Error(
      "lessonId is required."
    );
  }

  const lesson =
    registry.get(
      lessonId
    );

  if (!lesson) {
    return {
      found: false,
      lesson: null,
      content: null,
      error:
        "Lesson is not registered: " +
        lessonId
    };
  }

  const content =
    loadContent(
      store,
      lessonId
    );

  if (!content) {
    return {
      found: false,
      lesson,
      content: null,
      error:
        "Lesson content is not loaded yet: " +
        lessonId
    };
  }

  return {
    found: true,
    lesson,
    content,
    error: null
  };
}


/**
 * Build and validate prepared lesson content.
 *
 * Brick 21 + Brick 22:
 *
 * lessonContent format
 *       ↓
 * lessonBuilder format
 *       ↓
 * lessonValidator
 *       ↓
 * validated complete lesson
 *
 * This function does NOT create academic content.
 */
function buildValidatedLesson(
  content
) {
  if (
    !content ||
    typeof content !== "object"
  ) {
    return {
      valid: false,
      lesson: null,
      errors: [
        "Lesson content must be an object."
      ],
      warnings: []
    };
  }

  const {
    buildLesson
  } = require("./lessonBuilder");

  const {
    validateCompleteLesson
  } = require("./lessonValidator");

  const builderInput = {
    id:
      content.lessonId,

    title:
      content.title,

    category:
      content.category,

    skill:
      content.skillId,

    difficulty:
      normalizeLessonDifficulty(
        content.difficulty
      ),

    introduction:
      content.intro,

    concepts:
      Array.isArray(
        content.concepts
      )
        ? content.concepts
        : [],

    applications:
      Array.isArray(
        content.applications
      )
        ? content.applications
        : [],

    examConnections:
      collectExamConnections(
        content
      ),

    /**
     * Brick 22 fix:
     *
     * Preserve the Final Stretch from
     * lessonContent when building the
     * final lesson.
     */
    finalStretch:
      content.finalStretch,

    completion:
      content.completion,

    metadata:
      content.sourceMetadata || {}
  };

  let builtLesson;

  try {
    builtLesson =
      buildLesson(
        builderInput
      );
  } catch (error) {
    return {
      valid: false,
      lesson: null,
      errors: [
        error &&
        error.message
          ? error.message
          : "Lesson building failed."
      ],
      warnings: []
    };
  }

  const validation =
    validateCompleteLesson(
      builtLesson
    );

  return {
    valid:
      validation.valid,

    lesson:
      validation.valid
        ? builtLesson
        : null,

    errors:
      validation.errors,

    warnings:
      validation.warnings
  };
}


/**
 * Convert lessonContent difficulty into
 * the values currently accepted by
 * lessonBuilder.
 *
 * Supported builder values:
 * - easy
 * - medium
 * - hard
 *
 * "easy-to-hard" represents a progression,
 * so it is temporarily represented as
 * medium at the lesson metadata level.
 */
function normalizeLessonDifficulty(
  difficulty
) {
  if (
    difficulty === "easy" ||
    difficulty === "medium" ||
    difficulty === "hard"
  ) {
    return difficulty;
  }

  if (
    difficulty === "easy-to-hard"
  ) {
    return "medium";
  }

  return "medium";
}


/**
 * Collect authentic exam connections
 * when they are actually present.
 *
 * We never manufacture exam questions
 * or exam provenance.
 */
function collectExamConnections(
  content
) {
  if (
    Array.isArray(
      content.examConnections
    )
  ) {
    return content.examConnections;
  }

  if (
    content.examConnection
  ) {
    return [
      content.examConnection
    ];
  }

  return [];
}


/**
 * Get all lesson IDs that have content.
 */
function getLoadedLessonIds(
  store
) {
  if (!(store instanceof Map)) {
    return [];
  }

  return Array.from(
    store.keys()
  );
}


/**
 * Get the number of lessons with loaded content.
 */
function getLoadedContentCount(
  store
) {
  if (!(store instanceof Map)) {
    return 0;
  }

  return store.size;
}


/**
 * Find registered lessons that still
 * need content.
 */
function getMissingContentLessons(
  registry,
  store
) {
  if (
    !registry ||
    typeof registry.values !== "function"
  ) {
    return [];
  }

  const contentStore =
    store instanceof Map
      ? store
      : new Map();

  const missing = [];

  for (
    const lesson of registry.values()
  ) {
    if (
      !contentStore.has(
        lesson.id
      )
    ) {
      missing.push(
        lesson
      );
    }
  }

  return missing;
}


/**
 * Check whether every registered lesson
 * has content.
 */
function isContentComplete(
  registry,
  store
) {
  return (
    getMissingContentLessons(
      registry,
      store
    ).length === 0
  );
}


/**
 * Validate that every content entry
 * belongs to a registered lesson.
 */
function validateContentOwnership(
  registry,
  store
) {
  const errors = [];

  if (
    !registry ||
    typeof registry.has !== "function"
  ) {
    return {
      valid: false,
      errors: [
        "A valid lesson registry is required."
      ]
    };
  }

  if (!(store instanceof Map)) {
    return {
      valid: false,
      errors: [
        "A valid content store is required."
      ]
    };
  }

  store.forEach(
    (content, lessonId) => {
      if (
        !registry.has(
          lessonId
        )
      ) {
        errors.push(
          "Content exists for an unregistered lesson: " +
            lessonId
        );
      }

      if (
        content === undefined ||
        content === null
      ) {
        errors.push(
          "Content is empty for lesson: " +
            lessonId
        );
      }
    }
  );

  return {
    valid:
      errors.length === 0,
    errors
  };
}


/**
 * Create a simple loading report.
 */
function getContentStats(
  registry,
  store
) {
  const loaded =
    getLoadedContentCount(
      store
    );

  const missing =
    getMissingContentLessons(
      registry,
      store
    );

  return {
    registeredLessons:
      registry &&
      typeof registry.size === "number"
        ? registry.size
        : 0,

    loadedLessons:
      loaded,

    missingLessons:
      missing.length,

    complete:
      missing.length === 0
  };
}


/**
 * Internal helper.
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
 * Internal helper.
 */
function isPlainObject(
  value
) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}


/**
 * Public API.
 */
module.exports = {
  createContentStore,
  registerContent,

  hasContent,
  loadContent,
  loadRegisteredContent,

  buildValidatedLesson,

  getLoadedLessonIds,
  getLoadedContentCount,

  getMissingContentLessons,
  isContentComplete,

  validateContentOwnership,
  getContentStats
};
