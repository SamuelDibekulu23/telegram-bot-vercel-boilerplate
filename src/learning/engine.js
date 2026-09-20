const {
  getReadyEnglishLesson
} = require("../content/english/contentLoader");

const {
  LESSON_SECTION_TYPES
} = require("../content/english/lessonBuilder");

function startLesson(lessonId) {
  const result =
    getReadyEnglishLesson(
      lessonId
    );

  if (!result.ready) {
    return {
      ready: false,
      lesson: null,
      state: null,
      errors: result.errors,
      warnings: result.warnings
    };
  }

  const lesson =
    result.lesson;

  return {
    ready: true,
    lesson,
    state: createLessonState(
      lesson
    ),
    errors: [],
    warnings: result.warnings
  };
}

function createLessonState(lesson) {
  return {
    lessonId: lesson.id,
    currentIndex: 0,
    completedSections: [],
    completedConcepts: [],
    finished: false
  };
}

function getCurrentSection(
  lesson,
  state
) {
  if (
    !lesson ||
    !state ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return null;
  }

  if (
    state.currentIndex < 0 ||
    state.currentIndex >=
      lesson.sections.length
  ) {
    return null;
  }

  return lesson.sections[
    state.currentIndex
  ];
}

function completeCurrentSection(
  lesson,
  state
) {
  const section =
    getCurrentSection(
      lesson,
      state
    );

  if (!section) {
    return {
      completed: false,
      state,
      next: null
    };
  }

  const completedIds =
    new Set(
      state.completedSections
    );

  if (section.id) {
    completedIds.add(
      section.id
    );
  }

  const concepts =
    new Set(
      state.completedConcepts
    );

  if (
    section.type ===
      LESSON_SECTION_TYPES.CONCEPT &&
    section.conceptId
  ) {
    concepts.add(
      section.conceptId
    );
  }

  const nextIndex =
    state.currentIndex + 1;

  const finished =
    nextIndex >=
    lesson.sections.length;

  const nextState = {
    ...state,
    currentIndex:
      finished
        ? state.currentIndex
        : nextIndex,
    completedSections:
      Array.from(
        completedIds
      ),
    completedConcepts:
      Array.from(
        concepts
      ),
    finished
  };

  return {
    completed: true,
    state: nextState,
    next:
      finished
        ? null
        : lesson.sections[
            nextIndex
          ]
  };
}

function skipToSection(
  lesson,
  state,
  index
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return {
      success: false,
      state,
      section: null
    };
  }

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= lesson.sections.length
  ) {
    return {
      success: false,
      state,
      section: null
    };
  }

  return {
    success: true,
    state: {
      ...state,
      currentIndex: index,
      finished: false
    },
    section:
      lesson.sections[index]
  };
}

function getProgress(
  lesson,
  state
) {
  if (
    !lesson ||
    !state ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return {
      current: 0,
      total: 0,
      percentage: 0
    };
  }

  const total =
    lesson.sections.length;

  const current =
    Math.min(
      state.currentIndex + 1,
      total
    );

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (current / total) * 100
        );

  return {
    current,
    total,
    percentage
  };
}

function getSectionLabel(
  section
) {
  if (!section) {
    return "Unknown";
  }

  const labels = {
    [LESSON_SECTION_TYPES.INTRODUCTION]:
      "👋 START HERE",
    [LESSON_SECTION_TYPES.CONCEPT]:
      "🧠 CONCEPT",
    [LESSON_SECTION_TYPES.NOTE]:
      "📝 NOTE",
    [LESSON_SECTION_TYPES.EXAMPLE]:
      "💡 EXAMPLE",
    [LESSON_SECTION_TYPES.QUICK_CHECK]:
      "⚡ QUICK CHECK",
    [LESSON_SECTION_TYPES.APPLICATION]:
      "🎯 APPLICATION",
    [LESSON_SECTION_TYPES.EXAM_CONNECTION]:
      "📄 EXAM CONNECTION",
    [LESSON_SECTION_TYPES.FINAL_STRETCH]:
      "🎯 FINAL STRETCH",
    [LESSON_SECTION_TYPES.COMPLETION]:
      "🏁 COMPLETE"
  };

  return (
    labels[section.type] ||
    section.type
  );
}

function getConceptNumber(
  lesson,
  section
) {
  if (
    !lesson ||
    !section ||
    section.type !==
      LESSON_SECTION_TYPES.CONCEPT
  ) {
    return null;
  }

  const concepts =
    lesson.sections.filter(
      item =>
        item.type ===
        LESSON_SECTION_TYPES.CONCEPT
    );

  const index =
    concepts.findIndex(
      item =>
        item.id === section.id
    );

  return index === -1
    ? null
    : index + 1;
}

function isLessonFinished(
  state
) {
  return Boolean(
    state &&
      state.finished
  );
}

module.exports = {
  startLesson,
  createLessonState,
  getCurrentSection,
  completeCurrentSection,
  skipToSection,
  getProgress,
  getSectionLabel,
  getConceptNumber,
  isLessonFinished
};
