/**
 * FineBot English Content Registry
 *
 * Purpose:
 * Keeps the English lesson definitions in one place.
 *
 * This registry does NOT contain the actual lesson content.
 * It connects FineBot lesson IDs to the lesson metadata
 * already defined in lessons.js.
 *
 * Main responsibilities:
 * - register lessons
 * - prevent duplicate lesson IDs
 * - find lessons quickly
 * - filter lessons by category
 * - filter lessons by skill
 * - preserve lesson order
 */

const {
  getEnglishLessons,
  getLessonById
} = require("./lessons");


/**
 * Create a content registry.
 *
 * A Map gives us reliable ID-based lookup while
 * preserving insertion order.
 */
function createRegistry(lessons = []) {
  if (!Array.isArray(lessons)) {
    throw new Error(
      "Lessons must be an array."
    );
  }

  const registry = new Map();

  lessons.forEach((lesson) => {
    registerLesson(
      registry,
      lesson
    );
  });

  return registry;
}


/**
 * Register one lesson.
 */
function registerLesson(
  registry,
  lesson
) {
  if (!(registry instanceof Map)) {
    throw new Error(
      "Registry must be a Map."
    );
  }

  if (!lesson || typeof lesson !== "object") {
    throw new Error(
      "Lesson must be an object."
    );
  }

  if (!isNonEmptyString(lesson.id)) {
    throw new Error(
      "Lesson id is required."
    );
  }

  if (registry.has(lesson.id)) {
    throw new Error(
      "Duplicate lesson ID: " +
        lesson.id
    );
  }

  registry.set(
    lesson.id,
    lesson
  );

  return lesson;
}


/**
 * Create the default English registry
 * from lessons.js.
 */
function createEnglishRegistry() {
  const lessons =
    getEnglishLessons();

  return createRegistry(
    lessons
  );
}


/**
 * Find a lesson by ID.
 */
function findLesson(
  registry,
  lessonId
) {
  if (!(registry instanceof Map)) {
    return null;
  }

  if (!isNonEmptyString(lessonId)) {
    return null;
  }

  return (
    registry.get(lessonId) ||
    null
  );
}


/**
 * Check whether a lesson exists.
 */
function hasLesson(
  registry,
  lessonId
) {
  return (
    registry instanceof Map &&
    registry.has(lessonId)
  );
}


/**
 * Get every registered lesson
 * in its original order.
 */
function getAllLessons(
  registry
) {
  if (!(registry instanceof Map)) {
    return [];
  }

  return Array.from(
    registry.values()
  );
}


/**
 * Get lessons from one category.
 */
function getLessonsByCategory(
  registry,
  category
) {
  if (!(registry instanceof Map)) {
    return [];
  }

  if (!isNonEmptyString(category)) {
    return [];
  }

  return getAllLessons(
    registry
  ).filter(
    (lesson) =>
      lesson.category === category
  );
}


/**
 * Get lessons for one skill.
 */
function getLessonsBySkill(
  registry,
  skill
) {
  if (!(registry instanceof Map)) {
    return [];
  }

  if (!isNonEmptyString(skill)) {
    return [];
  }

  return getAllLessons(
    registry
  ).filter(
    (lesson) =>
      lesson.skill === skill
  );
}


/**
 * Get the position of a lesson
 * inside the registry.
 *
 * Returns zero-based index.
 */
function getLessonIndex(
  registry,
  lessonId
) {
  const lessons =
    getAllLessons(
      registry
    );

  return lessons.findIndex(
    (lesson) =>
      lesson.id === lessonId
  );
}


/**
 * Get the next lesson.
 *
 * Returns null when the requested lesson
 * is the final registered lesson.
 */
function getNextLesson(
  registry,
  lessonId
) {
  const index =
    getLessonIndex(
      registry,
      lessonId
    );

  if (index === -1) {
    return null;
  }

  const lessons =
    getAllLessons(
      registry
    );

  if (
    index + 1 >=
    lessons.length
  ) {
    return null;
  }

  return lessons[
    index + 1
  ];
}


/**
 * Get the previous lesson.
 */
function getPreviousLesson(
  registry,
  lessonId
) {
  const index =
    getLessonIndex(
      registry,
      lessonId
    );

  if (index <= 0) {
    return null;
  }

  const lessons =
    getAllLessons(
      registry
    );

  return lessons[
    index - 1
  ];
}


/**
 * Get simple registry statistics.
 */
function getRegistryStats(
  registry
) {
  const lessons =
    getAllLessons(
      registry
    );

  const categories =
    new Set();

  const skills =
    new Set();

  lessons.forEach(
    (lesson) => {
      if (
        isNonEmptyString(
          lesson.category
        )
      ) {
        categories.add(
          lesson.category
        );
      }

      if (
        isNonEmptyString(
          lesson.skill
        )
      ) {
        skills.add(
          lesson.skill
        );
      }
    }
  );

  return {
    lessonCount:
      lessons.length,

    categoryCount:
      categories.size,

    skillCount:
      skills.size,

    categories:
      Array.from(categories),

    skills:
      Array.from(skills)
  };
}


/**
 * Validate registry integrity.
 *
 * This checks the registry itself rather than
 * the full lesson content.
 */
function validateRegistry(
  registry
) {
  const errors = [];

  if (!(registry instanceof Map)) {
    return {
      valid: false,
      errors: [
        "Registry must be a Map."
      ]
    };
  }

  const ids =
    new Set();

  registry.forEach(
    (lesson, key) => {
      if (
        !lesson ||
        typeof lesson !== "object"
      ) {
        errors.push(
          "Registry entry " +
            key +
            " is not a valid lesson."
        );

        return;
      }

      if (
        !isNonEmptyString(
          lesson.id
        )
      ) {
        errors.push(
          "Registry entry " +
            key +
            " has no lesson ID."
        );
      }

      if (
        lesson.id !== key
      ) {
        errors.push(
          "Registry key " +
            key +
            " does not match lesson ID " +
            lesson.id +
            "."
        );
      }

      if (ids.has(key)) {
        errors.push(
          "Duplicate registry ID: " +
            key
        );
      }

      ids.add(key);
    }
  );

  return {
    valid:
      errors.length === 0,
    errors
  };
}


/**
 * Build a fresh default registry.
 *
 * This function is intentionally explicit so callers
 * can request a clean registry whenever needed.
 */
function loadEnglishContent() {
  return createEnglishRegistry();
}


/**
 * Compatibility helper.
 *
 * The source lesson module already knows how to find
 * lessons by ID. This helper keeps registry-based
 * code independent from that implementation detail.
 */
function findSourceLesson(
  lessonId
) {
  if (!isNonEmptyString(lessonId)) {
    return null;
  }

  return (
    getLessonById(
      lessonId
    ) || null
  );
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


module.exports = {
  createRegistry,
  createEnglishRegistry,

  registerLesson,

  findLesson,
  findSourceLesson,
  hasLesson,

  getAllLessons,
  getLessonsByCategory,
  getLessonsBySkill,

  getLessonIndex,
  getNextLesson,
  getPreviousLesson,

  getRegistryStats,
  validateRegistry,

  loadEnglishContent
};
