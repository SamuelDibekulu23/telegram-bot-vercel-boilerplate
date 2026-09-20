const {
  getEnglishMenu
} = require("./menu");

const {
  selectEnglishLesson
} = require("./selection");

function getLearnEnglishMenu() {
  return getEnglishMenu();
}

function openEnglishLesson(
  lessonId
) {
  return selectEnglishLesson(
    lessonId
  );
}

function getEnglishCategory(
  category
) {
  const menu =
    getEnglishMenu();

  return (
    menu.find(
      item =>
        item.category ===
        category
    ) || null
  );
}

module.exports = {
  getLearnEnglishMenu,
  openEnglishLesson,
  getEnglishCategory
};
