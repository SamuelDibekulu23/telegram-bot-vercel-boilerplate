/**
 * FineBot English Lesson Progression Engine
 *
 * Purpose:
 * Controls the student's movement through a lesson.
 *
 * It does NOT decide:
 * - what the student learns
 * - which template is used
 * - which question is asked
 * - how XP is stored
 *
 * It only manages lesson progression and the
 * visual/motivational state of the lesson.
 */

const PROGRESSION_PHASES = {
  QUICK_START: "quick_start",
  NORMAL: "normal",
  FINAL_STRETCH: "final_stretch",
  COMPLETE: "complete"
};

const DEFAULT_XP = {
  CONCEPT: 10,
  LESSON: 10
};


/**
 * Create a new lesson progression state.
 *
 * totalConcepts must represent the actual number
 * of concepts in the lesson.
 */
function createProgression(totalConcepts) {
  if (!Number.isInteger(totalConcepts) || totalConcepts <= 0) {
    throw new Error("totalConcepts must be a positive integer.");
  }

  return {
    currentConcept: 1,
    totalConcepts,
    completedConcepts: 0,
    completed: false,
    xpEarned: 0
  };
}


/**
 * Calculate accurate lesson percentage.
 *
 * Before the first concept is completed, progress
 * remains at the starting point.
 */
function getProgressPercentage(state) {
  if (!state || !Number.isInteger(state.totalConcepts)) {
    return 0;
  }

  if (state.completed) {
    return 100;
  }

  if (state.completedConcepts <= 0) {
    return Math.round(100 / state.totalConcepts);
  }

  return Math.min(
    100,
    Math.round(
      (state.completedConcepts / state.totalConcepts) * 100
    )
  );
}


/**
 * Determine the current progression phase.
 */
function getProgressionPhase(state) {
  if (!state) {
    return PROGRESSION_PHASES.QUICK_START;
  }

  if (state.completed) {
    return PROGRESSION_PHASES.COMPLETE;
  }

  const percentage = getProgressPercentage(state);

  if (state.completedConcepts === 0) {
    return PROGRESSION_PHASES.QUICK_START;
  }

  if (percentage >= 80) {
    return PROGRESSION_PHASES.FINAL_STRETCH;
  }

  return PROGRESSION_PHASES.NORMAL;
}


/**
 * Get the appropriate progression message.
 */
function getProgressionMessage(state) {
  const phase = getProgressionPhase(state);

  switch (phase) {
    case PROGRESSION_PHASES.QUICK_START:
      return {
        title: "🚀 QUICK START",
        message: "You're already moving!",
        encouragement: "Let's knock out the first one. 😎"
      };

    case PROGRESSION_PHASES.NORMAL:
      return {
        title: "🧠 KEEP GOING",
        message: "One idea at a time.",
        encouragement: "No need to rush."
      };

    case PROGRESSION_PHASES.FINAL_STRETCH:
      return {
        title: "🎯 FINAL STRETCH",
        message: "You're almost there.",
        encouragement: "One more concept and you've got this."
      };

    case PROGRESSION_PHASES.COMPLETE:
      return {
        title: "🏁 SKILL COMPLETE!",
        message: "You built another piece of your toolkit.",
        encouragement: "Nice work! 🎉"
      };

    default:
      return {
        title: "🧠 KEEP GOING",
        message: "One idea at a time.",
        encouragement: "You've got this."
      };
  }
}


/**
 * Create a visual progress bar.
 *
 * The bar always reflects the real lesson state.
 */
function createProgressBar(
  percentage,
  filledCharacter = "█",
  emptyCharacter = "░",
  length = 14
) {
  const safePercentage = Math.max(
    0,
    Math.min(100, percentage)
  );

  const filled = Math.round(
    (safePercentage / 100) * length
  );

  const empty = length - filled;

  return (
    filledCharacter.repeat(filled) +
    emptyCharacter.repeat(empty)
  );
}


/**
 * Get complete progress display information.
 */
function getProgressDisplay(state) {
  const percentage = getProgressPercentage(state);
  const phase = getProgressionPhase(state);
  const message = getProgressionMessage(state);

  return {
    percentage,
    phase,
    bar: createProgressBar(percentage),
    currentConcept: state.currentConcept,
    totalConcepts: state.totalConcepts,
    completedConcepts: state.completedConcepts,
    title: message.title,
    message: message.message,
    encouragement: message.encouragement
  };
}


/**
 * Complete the current concept.
 *
 * This moves the student forward by exactly one
 * concept and awards concept XP.
 */
function completeConcept(state, conceptXp = DEFAULT_XP.CONCEPT) {
  if (!state || state.completed) {
    return state;
  }

  const nextState = {
    ...state,
    completedConcepts: Math.min(
      state.totalConcepts,
      state.completedConcepts + 1
    ),
    xpEarned: state.xpEarned + conceptXp
  };

  if (
    nextState.completedConcepts >=
    nextState.totalConcepts
  ) {
    nextState.completed = true;
    nextState.currentConcept = nextState.totalConcepts;
  } else {
    nextState.currentConcept =
      nextState.completedConcepts + 1;
  }

  return nextState;
}


/**
 * Complete the entire lesson.
 *
 * Lesson XP is separate from concept XP.
 */
function completeLesson(
  state,
  lessonXp = DEFAULT_XP.LESSON
) {
  if (!state) {
    return null;
  }

  return {
    ...state,
    completedConcepts: state.totalConcepts,
    currentConcept: state.totalConcepts,
    completed: true,
    xpEarned: state.xpEarned + lessonXp
  };
}


/**
 * Determine whether the student has completed
 * the lesson.
 */
function isLessonComplete(state) {
  return Boolean(state && state.completed);
}


/**
 * Determine whether there is another concept.
 */
function hasNextConcept(state) {
  return Boolean(
    state &&
    !state.completed &&
    state.completedConcepts < state.totalConcepts
  );
}


/**
 * Get the next concept number.
 */
function getNextConcept(state) {
  if (!hasNextConcept(state)) {
    return null;
  }

  return state.completedConcepts + 1;
}


/**
 * Create the standard concept progress message.
 */
function getConceptHeader(state) {
  if (!state) {
    return "";
  }

  if (state.completed) {
    return "🏁 SKILL COMPLETE!";
  }

  return `🧠 CONCEPT ${state.currentConcept}/${state.totalConcepts}`;
}


/**
 * Create a complete lesson progress snapshot.
 *
 * This is useful later for Telegram rendering,
 * database persistence, testing, and analytics.
 */
function getProgressSnapshot(state) {
  const display = getProgressDisplay(state);

  return {
    currentConcept: display.currentConcept,
    totalConcepts: display.totalConcepts,
    completedConcepts: display.completedConcepts,
    percentage: display.percentage,
    phase: display.phase,
    progressBar: display.bar,
    completed: isLessonComplete(state),
    hasNext: hasNextConcept(state),
    nextConcept: getNextConcept(state),
    xpEarned: state.xpEarned,
    header: getConceptHeader(state),
    title: display.title,
    message: display.message,
    encouragement: display.encouragement
  };
}


module.exports = {
  PROGRESSION_PHASES,
  DEFAULT_XP,

  createProgression,
  getProgressPercentage,
  getProgressionPhase,
  getProgressionMessage,
  createProgressBar,
  getProgressDisplay,

  completeConcept,
  completeLesson,
  isLessonComplete,
  hasNextConcept,
  getNextConcept,
  getConceptHeader,
  getProgressSnapshot
};
