/**
 * FineBot English Exam Connection Engine
 *
 * Connects a learned English skill or concept
 * to authentic examination material.
 *
 * This module does NOT create or rewrite
 * previous exam questions.
 */

const EXAM_SOURCE_TYPE = "exact_exam_paper";


function createExamConnection({
  id,
  conceptId,
  skill,
  examYear,
  paperName,
  questionNumber,
  sourceReference,
  verified = false,
  examQuestionId = null,
  connectionNote = null
} = {}) {
  validateRequiredString(id, "id");
  validateRequiredString(conceptId, "conceptId");
  validateRequiredString(skill, "skill");
  validateExamYear(examYear);
  validateRequiredString(paperName, "paperName");

  if (
    questionNumber === undefined ||
    questionNumber === null ||
    String(questionNumber).trim() === ""
  ) {
    throw new Error("questionNumber is required.");
  }

  validateRequiredString(
    sourceReference,
    "sourceReference"
  );

  if (typeof verified !== "boolean") {
    throw new Error("verified must be boolean.");
  }

  if (verified && !examQuestionId) {
    throw new Error(
      "A verified exam connection must have an examQuestionId."
    );
  }

  return {
    id,
    sourceType: EXAM_SOURCE_TYPE,
    conceptId,
    skill,
    examYear,
    paperName,
    questionNumber,
    sourceReference,
    verified,
    examQuestionId,
    connectionNote
  };
}


function validateExamConnection(connection) {
  const errors = [];

  if (!connection || typeof connection !== "object") {
    return {
      valid: false,
      errors: ["Exam connection must be an object."]
    };
  }

  if (!isNonEmptyString(connection.id)) {
    errors.push("id is required.");
  }

  if (!isNonEmptyString(connection.conceptId)) {
    errors.push("conceptId is required.");
  }

  if (!isNonEmptyString(connection.skill)) {
    errors.push("skill is required.");
  }

  if (connection.sourceType !== EXAM_SOURCE_TYPE) {
    errors.push(
      "sourceType must be exact_exam_paper."
    );
  }

  if (!isValidExamYear(connection.examYear)) {
    errors.push("examYear must be a valid year.");
  }

  if (!isNonEmptyString(connection.paperName)) {
    errors.push("paperName is required.");
  }

  if (
    connection.questionNumber === undefined ||
    connection.questionNumber === null ||
    String(connection.questionNumber).trim() === ""
  ) {
    errors.push("questionNumber is required.");
  }

  if (!isNonEmptyString(connection.sourceReference)) {
    errors.push("sourceReference is required.");
  }

  if (typeof connection.verified !== "boolean") {
    errors.push("verified must be boolean.");
  }

  if (
    connection.verified &&
    !isNonEmptyString(connection.examQuestionId)
  ) {
    errors.push(
      "Verified connections require examQuestionId."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


function validateExamConnections(connections) {
  if (!Array.isArray(connections)) {
    return {
      valid: false,
      errors: ["Exam connections must be an array."]
    };
  }

  const errors = [];

  connections.forEach((connection, index) => {
    const result = validateExamConnection(connection);

    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push(
          "Connection " + index + ": " + error
        );
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


function getExamConnectionById(connections, id) {
  if (!Array.isArray(connections)) {
    return null;
  }

  return (
    connections.find(
      (connection) => connection.id === id
    ) || null
  );
}


function getExamConnectionsForConcept(
  connections,
  conceptId
) {
  if (!Array.isArray(connections)) {
    return [];
  }

  return connections.filter(
    (connection) =>
      connection.conceptId === conceptId
  );
}


function getExamConnectionsForSkill(
  connections,
  skill
) {
  if (!Array.isArray(connections)) {
    return [];
  }

  return connections.filter(
    (connection) =>
      connection.skill === skill
  );
}


function getVerifiedExamConnections(connections) {
  if (!Array.isArray(connections)) {
    return [];
  }

  return connections.filter(
    (connection) =>
      connection.sourceType === EXAM_SOURCE_TYPE &&
      connection.verified === true
  );
}


function isVerifiedExamConnection(connection) {
  if (!connection) {
    return false;
  }

  if (
    connection.sourceType !== EXAM_SOURCE_TYPE
  ) {
    return false;
  }

  if (connection.verified !== true) {
    return false;
  }

  if (
    !isNonEmptyString(
      connection.examQuestionId
    )
  ) {
    return false;
  }

  if (!isValidExamYear(connection.examYear)) {
    return false;
  }

  if (!isNonEmptyString(connection.paperName)) {
    return false;
  }

  if (
    connection.questionNumber === undefined ||
    connection.questionNumber === null ||
    String(connection.questionNumber).trim() === ""
  ) {
    return false;
  }

  if (
    !isNonEmptyString(
      connection.sourceReference
    )
  ) {
    return false;
  }

  return true;
}


function getExamLabel(connection) {
  if (isVerifiedExamConnection(connection)) {
    return "📄 EXACT PREVIOUS EXAM PAPER QUESTION";
  }

  return "⚠️ SOURCE NOT VERIFIED";
}


function getExamProvenance(connection) {
  if (!connection) {
    return null;
  }

  return {
    examYear: connection.examYear,
    paperName: connection.paperName,
    questionNumber: connection.questionNumber,
    sourceReference: connection.sourceReference,
    verified: connection.verified
  };
}


function formatExamSource(connection) {
  if (!connection) {
    return "⚠️ Source unavailable";
  }

  const year =
    connection.examYear || "Unknown year";

  const paper =
    connection.paperName || "Unknown paper";

  const question =
    connection.questionNumber ||
    "Unknown question";

  return (
    String(year) +
    " • " +
    String(paper) +
    " • Q" +
    String(question)
  );
}


function createExamConnectionDisplay(connection) {
  if (!isVerifiedExamConnection(connection)) {
    return {
      label: "⚠️ SOURCE NOT VERIFIED",
      source: formatExamSource(connection),
      verified: false
    };
  }

  return {
    label:
      "📄 EXACT PREVIOUS EXAM PAPER QUESTION",
    source: formatExamSource(connection),
    verified: true
  };
}


function validateExamYear(year) {
  if (!isValidExamYear(year)) {
    throw new Error(
      "examYear must be a valid year."
    );
  }
}


function isValidExamYear(year) {
  return (
    Number.isInteger(year) &&
    year >= 1900 &&
    year <= 2100
  );
}


function validateRequiredString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    throw new Error(
      fieldName +
        " must be a non-empty string."
    );
  }
}


function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


module.exports = {
  EXAM_SOURCE_TYPE,

  createExamConnection,

  validateExamConnection,
  validateExamConnections,

  getExamConnectionById,
  getExamConnectionsForConcept,
  getExamConnectionsForSkill,
  getVerifiedExamConnections,

  isVerifiedExamConnection,

  getExamLabel,
  getExamProvenance,
  formatExamSource,
  createExamConnectionDisplay
};
