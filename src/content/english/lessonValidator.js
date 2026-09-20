const {
  LESSON_SECTION_TYPES,
  validateLesson
} = require("./lessonBuilder");

const {
  validateExamConnection,
  isVerifiedExamConnection
} = require("./examConnections");

function validateCompleteLesson(lesson) {
  const errors = [];
  const warnings = [];

  if (!lesson || typeof lesson !== "object") {
    return {
      valid: false,
      errors: ["Lesson must be an object."],
      warnings: []
    };
  }

  const structureResult = validateLesson(lesson);

  if (!structureResult.valid) {
    errors.push(...structureResult.errors);
  }

  if (!Array.isArray(lesson.sections)) {
    return {
      valid: false,
      errors,
      warnings
    };
  }

  validateLessonMetadata(
    lesson,
    errors,
    warnings
  );

  const conceptIds = collectConceptIds(
    lesson,
    errors
  );

  validateDuplicateIds(
    lesson,
    errors
  );

  validateSectionReferences(
    lesson,
    conceptIds,
    errors
  );

  validateConceptComponents(
    lesson,
    conceptIds,
    errors,
    warnings
  );

  validateApplications(
    lesson,
    conceptIds,
    errors,
    warnings
  );

  validateExamConnections(
    lesson,
    errors,
    warnings
  );

  validateLearningStructure(
    lesson,
    errors,
    warnings
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateLessonMetadata(
  lesson,
  errors,
  warnings
) {
  if (!isNonEmptyString(lesson.id)) {
    errors.push("Lesson id is required.");
  }

  if (!isNonEmptyString(lesson.title)) {
    errors.push("Lesson title is required.");
  }

  if (!isNonEmptyString(lesson.category)) {
    errors.push("Lesson category is required.");
  }

  if (!isNonEmptyString(lesson.skill)) {
    errors.push("Lesson skill is required.");
  }

  if (
    lesson.difficulty !== undefined &&
    !["easy", "medium", "hard"].includes(
      lesson.difficulty
    )
  ) {
    errors.push(
      "Lesson difficulty must be easy, medium, or hard."
    );
  }

  if (
    !lesson.metadata ||
    typeof lesson.metadata !== "object" ||
    Array.isArray(lesson.metadata)
  ) {
    warnings.push(
      "Lesson metadata is empty."
    );
  }
}

function collectConceptIds(
  lesson,
  errors
) {
  const conceptIds = new Set();

  lesson.sections.forEach(
    (section, index) => {
      if (
        section.type !==
        LESSON_SECTION_TYPES.CONCEPT
      ) {
        return;
      }

      const concept = section.content;

      if (
        !concept ||
        typeof concept !== "object"
      ) {
        errors.push(
          "Concept section " +
            index +
            " has no valid content."
        );
        return;
      }

      const conceptId =
        concept.id ||
        section.conceptId;

      if (!isNonEmptyString(conceptId)) {
        errors.push(
          "Concept section " +
            index +
            " must have a concept ID."
        );
        return;
      }

      if (conceptIds.has(conceptId)) {
        errors.push(
          "Duplicate concept ID: " +
            conceptId +
            "."
        );
        return;
      }

      conceptIds.add(conceptId);
    }
  );

  return conceptIds;
}

function validateDuplicateIds(
  lesson,
  errors
) {
  const ids = new Set();

  lesson.sections.forEach(
    (section, index) => {
      if (!isNonEmptyString(section.id)) {
        return;
      }

      if (ids.has(section.id)) {
        errors.push(
          "Duplicate section ID: " +
            section.id +
            " at section " +
            index +
            "."
        );
        return;
      }

      ids.add(section.id);
    }
  );
}

function validateSectionReferences(
  lesson,
  conceptIds,
  errors
) {
  const referenceTypes = [
    LESSON_SECTION_TYPES.NOTE,
    LESSON_SECTION_TYPES.EXAMPLE,
    LESSON_SECTION_TYPES.QUICK_CHECK,
    LESSON_SECTION_TYPES.APPLICATION,
    LESSON_SECTION_TYPES.EXAM_CONNECTION
  ];

  lesson.sections.forEach(
    (section, index) => {
      if (
        !referenceTypes.includes(
          section.type
        )
      ) {
        return;
      }

      if (
        !isNonEmptyString(
          section.conceptId
        )
      ) {
        errors.push(
          "Section " +
            index +
            " (" +
            section.type +
            ") must reference a concept."
        );
        return;
      }

      if (
        !conceptIds.has(
          section.conceptId
        )
      ) {
        errors.push(
          "Section " +
            index +
            " (" +
            section.type +
            ") references missing concept: " +
            section.conceptId +
            "."
        );
      }
    }
  );
}

function validateConceptComponents(
  lesson,
  conceptIds,
  errors,
  warnings
) {
  const concepts = getSections(
    lesson,
    LESSON_SECTION_TYPES.CONCEPT
  );

  const notesByConcept =
    countSectionsByConcept(
      lesson,
      LESSON_SECTION_TYPES.NOTE
    );

  const examplesByConcept =
    countSectionsByConcept(
      lesson,
      LESSON_SECTION_TYPES.EXAMPLE
    );

  const checksByConcept =
    countSectionsByConcept(
      lesson,
      LESSON_SECTION_TYPES.QUICK_CHECK
    );

  concepts.forEach(
    (section) => {
      const concept = section.content;

      const conceptId =
        concept && concept.id
          ? concept.id
          : section.conceptId;

      if (
        !conceptId ||
        !conceptIds.has(conceptId)
      ) {
        return;
      }

      if (!notesByConcept.has(conceptId)) {
        errors.push(
          "Concept " +
            conceptId +
            " has no note section."
        );
      }

      if (
        !examplesByConcept.has(
          conceptId
        )
      ) {
        errors.push(
          "Concept " +
            conceptId +
            " has no example section."
        );
      }

      if (
        !checksByConcept.has(
          conceptId
        )
      ) {
        errors.push(
          "Concept " +
            conceptId +
            " has no micro-check."
        );
      }
    }
  );

  if (
    notesByConcept.size >
    concepts.length
  ) {
    warnings.push(
      "There are more note sections than concept sections."
    );
  }

  if (
    examplesByConcept.size >
    concepts.length
  ) {
    warnings.push(
      "There are more example sections than concept sections."
    );
  }

  if (
    checksByConcept.size >
    concepts.length
  ) {
    warnings.push(
      "There are more micro-check groups than concept sections."
    );
  }
}

function validateApplications(
  lesson,
  conceptIds,
  errors,
  warnings
) {
  const applications = getSections(
    lesson,
    LESSON_SECTION_TYPES.APPLICATION
  );

  if (applications.length === 0) {
    errors.push(
      "Lesson must contain at least one application."
    );
    return;
  }

  applications.forEach(
    (section, index) => {
      const application =
        section.content;

      if (
        !application ||
        typeof application !== "object"
      ) {
        errors.push(
          "Application section " +
            index +
            " has no valid content."
        );
        return;
      }

      if (
        !isNonEmptyString(
          application.id
        ) &&
        !isNonEmptyString(
          section.id
        )
      ) {
        errors.push(
          "Application section " +
            index +
            " must have an ID."
        );
      }

      if (
        !isNonEmptyString(
          application.prompt
        )
      ) {
        errors.push(
          "Application " +
            index +
            " must have a prompt."
        );
      }

      if (
        !isNonEmptyString(
          application.skill
        )
      ) {
        errors.push(
          "Application " +
            index +
            " must have a skill."
        );
      }

      if (
        !isNonEmptyString(
          section.conceptId
        )
      ) {
        errors.push(
          "Application " +
            index +
            " must reference a concept."
        );
      } else if (
        !conceptIds.has(
          section.conceptId
        )
      ) {
        errors.push(
          "Application " +
            index +
            " references missing concept: " +
            section.conceptId +
            "."
        );
      }

      if (
        application.type ===
        "multiple_choice"
      ) {
        if (
          !Array.isArray(
            application.options
          ) ||
          application.options.length < 2
        ) {
          errors.push(
            "Application " +
              index +
              " must have at least two options."
          );
        }

        if (
          !Number.isInteger(
            application.correctAnswer
          )
        ) {
          errors.push(
            "Application " +
              index +
              " must have an integer correctAnswer."
          );
        } else if (
          Array.isArray(
            application.options
          ) &&
          (
            application.correctAnswer < 0 ||
            application.correctAnswer >=
              application.options.length
          )
        ) {
          errors.push(
            "Application " +
              index +
              " has a correctAnswer outside its options."
          );
        }
      }

      if (
        !isNonEmptyString(
          application.type
        )
      ) {
        warnings.push(
          "Application " +
            index +
            " has no application type."
        );
      }
    }
  );
}

function validateExamConnections(
  lesson,
  errors,
  warnings
) {
  lesson.sections.forEach(
    (section, index) => {
      if (
        section.type !==
        LESSON_SECTION_TYPES.EXAM_CONNECTION
      ) {
        return;
      }

      const connection =
        section.content;

      const result =
        validateExamConnection(
          connection
        );

      if (!result.valid) {
        result.errors.forEach(
          (error) => {
            errors.push(
              "Exam connection " +
                index +
                ": " +
                error
            );
          }
        );

        return;
      }

      if (
        connection.verified === true &&
        !isVerifiedExamConnection(
          connection
        )
      ) {
        errors.push(
          "Exam connection " +
            index +
            " is marked verified but does not contain complete verified provenance."
        );
      }

      if (
        connection.verified !== true
      ) {
        warnings.push(
          "Exam connection " +
            index +
            " is not verified."
        );
      }
    }
  );
}

function validateLearningStructure(
  lesson,
  errors,
  warnings
) {
  const concepts = getSections(
    lesson,
    LESSON_SECTION_TYPES.CONCEPT
  );

  const introductions = getSections(
    lesson,
    LESSON_SECTION_TYPES.INTRODUCTION
  );

  const completions = getSections(
    lesson,
    LESSON_SECTION_TYPES.COMPLETION
  );

  const quickChecks = getSections(
    lesson,
    LESSON_SECTION_TYPES.QUICK_CHECK
  );

  const applications = getSections(
    lesson,
    LESSON_SECTION_TYPES.APPLICATION
  );

  const finalStretches = getSections(
    lesson,
    LESSON_SECTION_TYPES.FINAL_STRETCH
  );

  if (concepts.length === 0) {
    errors.push(
      "Lesson must contain at least one concept."
    );
  }

  if (introductions.length === 0) {
    errors.push(
      "Lesson must contain an introduction."
    );
  }

  if (completions.length === 0) {
    errors.push(
      "Lesson must contain a completion section."
    );
  }

  if (
    concepts.length > 0 &&
    quickChecks.length === 0
  ) {
    errors.push(
      "Lesson has concepts but no micro-checks."
    );
  }

  if (applications.length === 0) {
    errors.push(
      "Lesson must contain at least one application."
    );
  }

  if (finalStretches.length === 0) {
    errors.push(
      "Lesson must contain a Final Stretch section."
    );
  }

  if (finalStretches.length > 1) {
    errors.push(
      "Lesson must contain only one Final Stretch section."
    );
  }

  if (introductions.length > 1) {
    warnings.push(
      "Lesson contains multiple introduction sections."
    );
  }

  if (completions.length > 1) {
    warnings.push(
      "Lesson contains multiple completion sections."
    );
  }

  validateConceptOrder(
    lesson,
    errors
  );

  validateFinalStretchOrder(
    lesson,
    errors
  );
}

function validateConceptOrder(
  lesson,
  errors
) {
  const concepts = getSections(
    lesson,
    LESSON_SECTION_TYPES.CONCEPT
  );

  const seen = new Set();

  concepts.forEach(
    (section, index) => {
      const concept =
        section.content;

      const conceptId =
        concept && concept.id
          ? concept.id
          : section.conceptId;

      if (!conceptId) {
        return;
      }

      if (seen.has(conceptId)) {
        errors.push(
          "Concept appears more than once: " +
            conceptId +
            "."
        );
      }

      seen.add(conceptId);

      if (
        index > 0 &&
        conceptId ===
          concepts[index - 1].conceptId
      ) {
        errors.push(
          "Consecutive concept sections reference the same concept: " +
            conceptId +
            "."
        );
      }
    }
  );
}

function validateFinalStretchOrder(
  lesson,
  errors
) {
  const finalStretchIndex =
    lesson.sections.findIndex(
      (section) =>
        section.type ===
        LESSON_SECTION_TYPES.FINAL_STRETCH
    );

  const completionIndex =
    lesson.sections.findIndex(
      (section) =>
        section.type ===
        LESSON_SECTION_TYPES.COMPLETION
    );

  if (
    finalStretchIndex === -1 ||
    completionIndex === -1
  ) {
    return;
  }

  if (
    finalStretchIndex >
    completionIndex
  ) {
    errors.push(
      "Final Stretch must appear before completion."
    );
  }
}

function countSectionsByConcept(
  lesson,
  type
) {
  const counts = new Map();

  getSections(
    lesson,
    type
  ).forEach(
    (section) => {
      if (
        !isNonEmptyString(
          section.conceptId
        )
      ) {
        return;
      }

      const current =
        counts.get(
          section.conceptId
        ) || 0;

      counts.set(
        section.conceptId,
        current + 1
      );
    }
  );

  return counts;
}

function getSections(
  lesson,
  type
) {
  if (
    !lesson ||
    !Array.isArray(
      lesson.sections
    )
  ) {
    return [];
  }

  return lesson.sections.filter(
    (section) =>
      section.type === type
  );
}

function isLessonReady(
  lesson
) {
  const result =
    validateCompleteLesson(
      lesson
    );

  return result.valid;
}

function getLessonQualityReport(
  lesson
) {
  const result =
    validateCompleteLesson(
      lesson
    );

  return {
    ready: result.valid,
    errorCount:
      result.errors.length,
    warningCount:
      result.warnings.length,
    errors:
      result.errors,
    warnings:
      result.warnings
  };
}

function isNonEmptyString(
  value
) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

module.exports = {
  validateCompleteLesson,
  isLessonReady,
  getLessonQualityReport
};
