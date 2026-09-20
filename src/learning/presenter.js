const {
  LESSON_SECTION_TYPES
} = require("../content/english/lessonBuilder");

function presentSection(
  lesson,
  state
) {
  if (
    !lesson ||
    !state ||
    !Array.isArray(lesson.sections)
  ) {
    return null;
  }

  const section =
    lesson.sections[state.currentIndex];

  if (!section) {
    return null;
  }

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    sectionId: section.id,
    type: section.type,
    label: getSectionLabel(section),
    title: getSectionTitle(section),
    content: getSectionContent(section),
    conceptNumber: getConceptNumber(
      lesson,
      section
    ),
    progress: getProgress(
      lesson,
      state
    )
  };
}

function getSectionLabel(section) {
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

function getSectionTitle(section) {
  if (section.title) {
    return section.title;
  }

  if (
    section.content &&
    section.content.title
  ) {
    return section.content.title;
  }

  return getSectionLabel(section);
}

function getSectionContent(section) {
  if (!section) {
    return null;
  }

  if (section.content) {
    return section.content;
  }

  return {
    ...section
  };
}

function getConceptNumber(
  lesson,
  section
) {
  if (
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

function getProgress(
  lesson,
  state
) {
  const total =
    lesson.sections.length;

  const current =
    Math.min(
      state.currentIndex + 1,
      total
    );

  return {
    current,
    total,
    percentage:
      total === 0
        ? 0
        : Math.round(
            (current / total) * 100
          )
  };
}

function formatSectionText(
  presentation
) {
  if (!presentation) {
    return "";
  }

  const progress =
    `${presentation.progress.current}/${presentation.progress.total}`;

  let text =
    `${presentation.label}\n\n`;

  text +=
    `📚 ${presentation.lessonTitle}\n`;

  if (presentation.conceptNumber) {
    text +=
      `Concept ${presentation.conceptNumber}\n`;
  }

  text +=
    `\n${presentation.title}\n`;

  text +=
    `\nProgress: ${progress} (${presentation.progress.percentage}%)`;

  return text;
}

module.exports = {
  presentSection,
  getSectionLabel,
  getSectionTitle,
  getSectionContent,
  getConceptNumber,
  getProgress,
  formatSectionText
};
