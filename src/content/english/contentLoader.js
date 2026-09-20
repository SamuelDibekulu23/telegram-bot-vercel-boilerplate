const {
  createEnglishRegistry,
  findLesson
} = require("./contentRegistry");

const {
  buildLesson
} = require("./lessonBuilder");

const {
  validateCompleteLesson
} = require("./lessonValidator");

const contentStore = new Map();

function createContentStore() {
  return new Map();
}

function registerContent(lessonId, content) {
  if (
    typeof lessonId !== "string" ||
    !lessonId.trim()
  ) {
    throw new Error("lessonId is required.");
  }

  if (
    !content ||
    typeof content !== "object"
  ) {
    throw new Error("content must be an object.");
  }

  contentStore.set(lessonId, content);

  return content;
}

function hasContent(lessonId) {
  return contentStore.has(lessonId);
}

function loadContent(lessonId) {
  return contentStore.get(lessonId) || null;
}

function loadRegisteredContent(lessonId) {
  const stored = loadContent(lessonId);

  if (stored) {
    return stored;
  }

  const registry = createEnglishRegistry();

  const sourceLesson = findLesson(
    registry,
    lessonId
  );

  if (!sourceLesson) {
    return null;
  }

  try {
    const content = require(
      "./lessonContent/" + lessonId
    );

    registerContent(
      lessonId,
      content
    );

    return content;
  } catch (error) {
    return null;
  }
}

function buildValidatedLesson(content) {
  if (
    !content ||
    typeof content !== "object"
  ) {
    return {
      valid: false,
      lesson: null,
      errors: [
        "Content must be an object."
      ],
      warnings: []
    };
  }

  const lessonId =
    content.lessonId ||
    content.id;

  if (
    typeof lessonId !== "string" ||
    !lessonId.trim()
  ) {
    return {
      valid: false,
      lesson: null,
      errors: [
        "Content must have a lessonId."
      ],
      warnings: []
    };
  }

  try {
    const lesson = buildLesson({
      id: lessonId,
      title: content.title,
      category: content.category,
      skill:
        content.skillId ||
        content.skill,
      difficulty:
        normalizeDifficulty(
          content.difficulty
        ),
      templateId:
        content.templateId,
      introduction:
        content.intro,
      concepts:
        content.concepts || [],
      applications:
        content.applications || [],
      examConnections:
        content.examConnections || [],
      finalStretch:
        content.finalStretch,
      completion:
        content.completion,
      metadata:
        content.sourceMetadata ||
        content.metadata
    });

    const validation =
      validateCompleteLesson(
        lesson
      );

    return {
      valid: validation.valid,
      lesson,
      errors: validation.errors,
      warnings: validation.warnings
    };
  } catch (error) {
    return {
      valid: false,
      lesson: null,
      errors: [
        error.message ||
          "Failed to build lesson."
      ],
      warnings: []
    };
  }
}

function getReadyEnglishLesson(lessonId) {
  const content =
    loadRegisteredContent(
      lessonId
    );

  if (!content) {
    return {
      ready: false,
      lesson: null,
      errors: [
        "English lesson content not found: " +
          lessonId
      ],
      warnings: []
    };
  }

  const result =
    buildValidatedLesson(
      content
    );

  return {
    ready: result.valid,
    lesson:
      result.valid
        ? result.lesson
        : null,
    errors: result.errors,
    warnings: result.warnings
  };
}

function getReadyLessonOrThrow(lessonId) {
  const result =
    getReadyEnglishLesson(
      lessonId
    );

  if (!result.ready) {
    throw new Error(
      result.errors.join(" ")
    );
  }

  return result.lesson;
}

function getLoadedLessonIds() {
  return Array.from(
    contentStore.keys()
  );
}

function getLoadedContentCount() {
  return contentStore.size;
}

function getMissingContentLessons() {
  const registry =
    createEnglishRegistry();

  const lessons =
    registry.lessons || [];

  return lessons
    .filter(
      lesson =>
        !hasContent(lesson.id)
    )
    .map(
      lesson =>
        lesson.id
    );
}

function isContentComplete() {
  return (
    getMissingContentLessons()
      .length === 0
  );
}

function validateContentOwnership(content) {
  if (
    !content ||
    typeof content !== "object"
  ) {
    return {
      valid: false,
      errors: [
        "Content must be an object."
      ]
    };
  }

  const lessonId =
    content.lessonId ||
    content.id;

  if (!lessonId) {
    return {
      valid: false,
      errors: [
        "Content lessonId is required."
      ]
    };
  }

  const registry =
    createEnglishRegistry();

  const sourceLesson =
    findLesson(
      registry,
      lessonId
    );

  if (!sourceLesson) {
    return {
      valid: false,
      errors: [
        "Lesson is not registered: " +
          lessonId
      ]
    };
  }

  const errors = [];

  if (
    content.title &&
    sourceLesson.title &&
    content.title !==
      sourceLesson.title
  ) {
    errors.push(
      "Content title does not match registry."
    );
  }

  if (
    content.category &&
    sourceLesson.category &&
    content.category !==
      sourceLesson.category
  ) {
    errors.push(
      "Content category does not match registry."
    );
  }

  if (
    content.skillId &&
    sourceLesson.skillId &&
    content.skillId !==
      sourceLesson.skillId
  ) {
    errors.push(
      "Content skill does not match registry."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function getContentStats() {
  const registry =
    createEnglishRegistry();

  const lessons =
    registry.lessons || [];

  return {
    registeredLessons:
      lessons.length,
    loadedLessons:
      contentStore.size,
    missingLessons:
      getMissingContentLessons().length,
    complete:
      isContentComplete()
  };
}

function normalizeDifficulty(difficulty) {
  if (
    difficulty ===
    "easy-to-hard"
  ) {
    return "medium";
  }

  if (
    ["easy", "medium", "hard"]
      .includes(difficulty)
  ) {
    return difficulty;
  }

  return "medium";
}

module.exports = {
  createContentStore,
  registerContent,
  hasContent,
  loadContent,
  loadRegisteredContent,
  buildValidatedLesson,
  getReadyEnglishLesson,
  getReadyLessonOrThrow,
  getLoadedLessonIds,
  getLoadedContentCount,
  getMissingContentLessons,
  isContentComplete,
  validateContentOwnership,
  getContentStats
};
