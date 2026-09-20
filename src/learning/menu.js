const {
  getEnglishLessons,
  getEnglishLessonsByCategory
} = require("./catalog");

const CATEGORY_ORDER = [
  "passage",
  "vocabulary",
  "dialogue",
  "grammar",
  "coherence",
  "writing"
];

const CATEGORY_INFO = {
  passage: {
    title: "Passage Skills",
    emoji: "📖"
  },
  vocabulary: {
    title: "Vocabulary",
    emoji: "🧠"
  },
  dialogue: {
    title: "Dialogue & Communication",
    emoji: "💬"
  },
  grammar: {
    title: "Grammar",
    emoji: "✏️"
  },
  coherence: {
    title: "Sentence & Coherence",
    emoji: "🧩"
  },
  writing: {
    title: "Writing",
    emoji: "📝"
  }
};

function getEnglishMenu() {
  return CATEGORY_ORDER.map(
    category => ({
      category,
      title:
        CATEGORY_INFO[
          category
        ].title,
      emoji:
        CATEGORY_INFO[
          category
        ].emoji,
      lessons:
        getEnglishLessonsByCategory(
          category
        ).map(
          lesson => ({
            id: lesson.id,
            title: lesson.title,
            skillId: lesson.skillId,
            difficulty:
              lesson.difficulty
          })
        )
    })
  );
}

function getEnglishMenuSummary() {
  const menu =
    getEnglishMenu();

  return menu.map(
    category => ({
      category:
        category.category,
      title:
        category.title,
      lessonCount:
        category.lessons.length
    })
  );
}

module.exports = {
  getEnglishMenu,
  getEnglishMenuSummary
};
