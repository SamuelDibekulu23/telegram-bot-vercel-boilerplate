const STREAMS = {
  NATURAL: "Natural",
  SOCIAL: "Social",
};

/*
 * Grade 12 school curriculum subjects.
 *
 * Scholastic Aptitude is intentionally NOT included here.
 * It is an exam-preparation category rather than an official
 * Grade 12 school curriculum subject.
 */
const CURRICULUM = {
  Natural: [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
  ],

  Social: [
    "English",
    "Mathematics",
    "Geography",
    "Economics",
    "History",
  ],
};

/*
 * Exam-only preparation.
 *
 * This is kept separate from the school curriculum so
 * FineBot never represents Scholastic Aptitude as a
 * Grade 12 classroom subject.
 */
const EXAM_PREPARATION = {
  "Scholastic Aptitude": {
    category: "exam-only",
    areas: [
      "Verbal Reasoning",
      "Numerical Reasoning",
      "Logical Reasoning",
      "Patterns and Sequences",
      "Relationships",
      "Analytical Reasoning",
      "Problem Solving",
    ],
  },
};

function isValidStream(stream) {
  return Object.values(STREAMS).includes(stream);
}

function isValidSubject(stream, subject) {
  if (!isValidStream(stream)) {
    return false;
  }

  return CURRICULUM[stream].includes(subject);
}

function isExamPreparationCategory(category) {
  return Object.prototype.hasOwnProperty.call(
    EXAM_PREPARATION,
    category
  );
}

function getSubjects(stream) {
  if (!isValidStream(stream)) {
    return [];
  }

  return [...CURRICULUM[stream]];
}

function getStreams() {
  return Object.values(STREAMS);
}

function getExamPreparationCategories() {
  return Object.keys(EXAM_PREPARATION);
}

function getExamPreparation(category) {
  if (!isExamPreparationCategory(category)) {
    return null;
  }

  return EXAM_PREPARATION[category];
}

module.exports = {
  STREAMS,
  CURRICULUM,
  EXAM_PREPARATION,
  isValidStream,
  isValidSubject,
  isExamPreparationCategory,
  getSubjects,
  getStreams,
  getExamPreparationCategories,
  getExamPreparation,
};
