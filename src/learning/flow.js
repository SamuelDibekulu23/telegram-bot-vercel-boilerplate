const {
  completeCurrentSection,
  getCurrentSection,
  getProgress
} = require("./engine");

function advanceLesson(
  lesson,
  state
) {
  if (
    !lesson ||
    !state
  ) {
    return {
      success: false,
      state,
      current: null,
      progress: null,
      finished: false
    };
  }

  const result =
    completeCurrentSection(
      lesson,
      state
    );

  return {
    success: result.completed,
    state: result.state,
    current:
      result.next ||
      getCurrentSection(
        lesson,
        result.state
      ),
    progress:
      getProgress(
        lesson,
        result.state
      ),
    finished:
      result.state.finished
  };
}

function getCurrentStep(
  lesson,
  state
) {
  const section =
    getCurrentSection(
      lesson,
      state
    );

  if (!section) {
    return null;
  }

  return {
    index: state.currentIndex,
    type: section.type,
    id: section.id || null,
    content:
      section.content ||
      section,
    progress:
      getProgress(
        lesson,
        state
      )
  };
}

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
    (section, index) => ({
      index,
      type: section.type,
      id: section.id || null
    })
  );
}

function getLearningState(
  lesson,
  state
) {
  if (
    !lesson ||
    !state
  ) {
    return null;
  }

  const current =
    getCurrentSection(
      lesson,
      state
    );

  const progress =
    getProgress(
      lesson,
      state
    );

  const totalConcepts =
    lesson.sections.filter(
      section =>
        section.type === "concept"
    ).length;

  return {
    lessonId:
      state.lessonId,
    currentIndex:
      state.currentIndex,
    currentType:
      current
        ? current.type
        : null,
    currentId:
      current
        ? current.id || null
        : null,
    completedSections:
      state.completedSections
        .length,
    completedConcepts:
      state.completedConcepts
        .length,
    totalSections:
      lesson.sections.length,
    totalConcepts,
    sectionProgress:
      progress,
    finished:
      state.finished
  };
}

module.exports = {
  advanceLesson,
  getCurrentStep,
  getLearningSequence,
  getLearningState
};
