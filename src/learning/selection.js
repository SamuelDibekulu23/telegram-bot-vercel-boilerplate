const {
  getEnglishLesson
} = require("./catalog");

const {
  createSession
} = require("./session");

function selectEnglishLesson(
  lessonId
) {
  const lesson =
    getEnglishLesson(
      lessonId
    );

  if (!lesson) {
    return {
      success: false,
      lesson: null,
      session: null,
      error:
        "English lesson not found."
    };
  }

  const session =
    createSession(
      lessonId
    );

  if (!session.success) {
    return {
      success: false,
      lesson,
      session: null,
      error:
        session.error
    };
  }

  return {
    success: true,
    lesson,
    session
  };
}

function canSelectEnglishLesson(
  lessonId
) {
  return Boolean(
    getEnglishLesson(
      lessonId
    )
  );
}

module.exports = {
  selectEnglishLesson,
  canSelectEnglishLesson
};
