const {
  startLesson,
  getCurrentSection,
  completeCurrentSection
} = require("./engine");

function begin(lessonId) {
  const result =
    startLesson(lessonId);

  if (!result.ready) {
    return {
      success: false,
      lesson: null,
      state: null,
      current: null,
      error: result.errors.join(" ")
    };
  }

  return {
    success: true,
    lesson: result.lesson,
    state: result.state,
    current: getCurrentSection(
      result.lesson,
      result.state
    ),
    finished: false
  };
}

function next(
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
    current: result.next,
    finished: result.state.finished
  };
}

function getStepSummary(
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
    finished: state.finished
  };
}

module.exports = {
  begin,
  next,
  getStepSummary
};
