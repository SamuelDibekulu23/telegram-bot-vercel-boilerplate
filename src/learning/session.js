const {
  startLesson,
  getCurrentSection,
  getProgress
} = require("./engine");

const {
  presentSection
} = require("./presenter");

function createSession(
  lessonId
) {
  const result =
    startLesson(
      lessonId
    );

  if (!result.ready) {
    return {
      success: false,
      lesson: null,
      state: null,
      error:
        result.errors.join(" ")
    };
  }

  return {
    success: true,
    lesson: result.lesson,
    state: result.state
  };
}

function getSnapshot(
  session
) {
  if (
    !session ||
    !session.lesson ||
    !session.state
  ) {
    return null;
  }

  const section =
    getCurrentSection(
      session.lesson,
      session.state
    );

  const presentation =
    presentSection(
      session.lesson,
      session.state
    );

  return {
    lessonId:
      session.lesson.id,
    lessonTitle:
      session.lesson.title,
    currentIndex:
      session.state.currentIndex,
    currentType:
      section
        ? section.type
        : null,
    currentId:
      section
        ? section.id || null
        : null,
    presentation,
    progress:
      getProgress(
        session.lesson,
        session.state
      ),
    finished:
      session.state.finished
  };
}

module.exports = {
  createSession,
  getSnapshot
};
