const {
  createEnglishRegistry,
  findLesson,
  getAllLessons
} = require("../content/english/contentRegistry");

function getRegistryLessons() {
  const registry =
    createEnglishRegistry();

  const lessons =
    getAllLessons(registry);

  return Array.isArray(lessons)
    ? lessons
    : [];
}

function getEnglishLessons() {
  return getRegistryLessons().map(
    lesson => ({
      id: lesson.id,
      title: lesson.title,
      category: lesson.category,
      skillId: lesson.skillId,
      difficulty: lesson.difficulty
    })
  );
}

function getEnglishLesson(
  lessonId
) {
  const registry =
    createEnglishRegistry();

  const lesson =
    findLesson(
      registry,
      lessonId
    );

  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    title: lesson.title,
    category: lesson.category,
    skillId: lesson.skillId,
    difficulty: lesson.difficulty
  };
}

function getEnglishLessonCount() {
  return getEnglishLessons()
    .length;
}

function getEnglishLessonsByCategory(
  category
) {
  return getEnglishLessons()
    .filter(
      lesson =>
        lesson.category ===
        category
    );
}

module.exports = {
  getEnglishLessons,
  getEnglishLesson,
  getEnglishLessonCount,
  getEnglishLessonsByCategory
};
