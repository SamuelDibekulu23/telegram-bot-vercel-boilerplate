const NOTE_STYLES = {
  RULE_CARD: "rule_card",
  MEMORY_TRICK: "memory_trick",
  TRAP_CARD: "trap_card",
  LOOK_CLOSER: "look_closer",
  BUILD_IT: "build_it",
  FUNNY_NOTE: "funny_note",
  REAL_LIFE: "real_life",
  EXAM_LENS: "exam_lens"
};

const NOTE_DEFINITIONS = {
  [NOTE_STYLES.RULE_CARD]: {
    id: NOTE_STYLES.RULE_CARD,
    name: "Rule Card",
    emoji: "📌",
    purpose: "State the core rule clearly and quickly.",
    fields: ["rule", "example", "remember"]
  },

  [NOTE_STYLES.MEMORY_TRICK]: {
    id: NOTE_STYLES.MEMORY_TRICK,
    name: "Memory Trick",
    emoji: "🧠",
    purpose: "Turn an important idea into an easier memory hook.",
    fields: ["idea", "memoryHook", "example"]
  },

  [NOTE_STYLES.TRAP_CARD]: {
    id: NOTE_STYLES.TRAP_CARD,
    name: "Trap Card",
    emoji: "⚠️",
    purpose: "Expose a common mistake or tempting wrong answer.",
    fields: ["trap", "whyItLooksRight", "correctApproach"]
  },

  [NOTE_STYLES.LOOK_CLOSER]: {
    id: NOTE_STYLES.LOOK_CLOSER,
    name: "Look Closer",
    emoji: "👀",
    purpose: "Highlight a detail students can easily overlook.",
    fields: ["detail", "whyItMatters", "example"]
  },

  [NOTE_STYLES.BUILD_IT]: {
    id: NOTE_STYLES.BUILD_IT,
    name: "Build It",
    emoji: "🏗️",
    purpose: "Construct the idea step by step.",
    fields: ["startingPoint", "stepOne", "stepTwo", "finishedIdea"]
  },

  [NOTE_STYLES.FUNNY_NOTE]: {
    id: NOTE_STYLES.FUNNY_NOTE,
    name: "Funny Note",
    emoji: "😄",
    purpose: "Use light humor to make an academic idea memorable.",
    fields: ["concept", "funnyHook", "realRule"]
  },

  [NOTE_STYLES.REAL_LIFE]: {
    id: NOTE_STYLES.REAL_LIFE,
    name: "Real-Life Connection",
    emoji: "🌍",
    purpose: "Connect the academic idea to an understandable real situation.",
    fields: ["concept", "situation", "connection"]
  },

  [NOTE_STYLES.EXAM_LENS]: {
    id: NOTE_STYLES.EXAM_LENS,
    name: "Exam Lens",
    emoji: "🎯",
    purpose: "Show how the skill can appear in exam questions.",
    fields: ["skill", "whatToLookFor", "examTip", "commonTrap"]
  }
};


/**
 * Create a note without forcing a specific presentation style.
 */
function createNote({
  style,
  title = null,
  data = {}
} = {}) {
  if (!isValidStyle(style)) {
    throw new Error(`Unknown note style: ${style}`);
  }

  if (!data || typeof data !== "object") {
    throw new Error("Note data must be an object.");
  }

  return {
    style,
    title,
    data
  };
}


/**
 * Get the definition of a note style.
 */
function getNoteDefinition(style) {
  return NOTE_DEFINITIONS[style] || null;
}


/**
 * Get every available note style.
 */
function getNoteStyles() {
  return Object.values(NOTE_DEFINITIONS);
}


/**
 * Check whether a note style exists.
 */
function isValidStyle(style) {
  return Object.prototype.hasOwnProperty.call(
    NOTE_DEFINITIONS,
    style
  );
}


/**
 * Validate the data required by a particular note style.
 */
function validateNote(note) {
  const errors = [];

  if (!note || typeof note !== "object") {
    return {
      valid: false,
      errors: ["Note must be an object."]
    };
  }

  if (!isValidStyle(note.style)) {
    errors.push(`Unknown note style: ${note.style}`);
    return {
      valid: false,
      errors
    };
  }

  if (!note.data || typeof note.data !== "object") {
    errors.push("Note data must be an object.");
    return {
      valid: false,
      errors
    };
  }

  const definition = getNoteDefinition(note.style);

  definition.fields.forEach((field) => {
    if (!isNonEmptyValue(note.data[field])) {
      errors.push(
        `${note.style}.${field} is required.`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * Create a Rule Card.
 */
function createRuleCard({
  rule,
  example,
  remember
} = {}) {
  return createNote({
    style: NOTE_STYLES.RULE_CARD,
    data: {
      rule,
      example,
      remember
    }
  });
}


/**
 * Create a Memory Trick.
 */
function createMemoryTrick({
  idea,
  memoryHook,
  example
} = {}) {
  return createNote({
    style: NOTE_STYLES.MEMORY_TRICK,
    data: {
      idea,
      memoryHook,
      example
    }
  });
}


/**
 * Create a Trap Card.
 */
function createTrapCard({
  trap,
  whyItLooksRight,
  correctApproach
} = {}) {
  return createNote({
    style: NOTE_STYLES.TRAP_CARD,
    data: {
      trap,
      whyItLooksRight,
      correctApproach
    }
  });
}


/**
 * Create a Look Closer note.
 */
function createLookCloser({
  detail,
  whyItMatters,
  example
} = {}) {
  return createNote({
    style: NOTE_STYLES.LOOK_CLOSER,
    data: {
      detail,
      whyItMatters,
      example
    }
  });
}


/**
 * Create a Build It note.
 */
function createBuildIt({
  startingPoint,
  stepOne,
  stepTwo,
  finishedIdea
} = {}) {
  return createNote({
    style: NOTE_STYLES.BUILD_IT,
    data: {
      startingPoint,
      stepOne,
      stepTwo,
      finishedIdea
    }
  });
}


/**
 * Create a Funny Note.
 *
 * Humor is stored separately from the academic rule
 * so the joke never replaces the actual explanation.
 */
function createFunnyNote({
  concept,
  funnyHook,
  realRule
} = {}) {
  return createNote({
    style: NOTE_STYLES.FUNNY_NOTE,
    data: {
      concept,
      funnyHook,
      realRule
    }
  });
}


/**
 * Create a Real-Life Connection.
 */
function createRealLifeConnection({
  concept,
  situation,
  connection
} = {}) {
  return createNote({
    style: NOTE_STYLES.REAL_LIFE,
    data: {
      concept,
      situation,
      connection
    }
  });
}


/**
 * Create an Exam Lens.
 */
function createExamLens({
  skill,
  whatToLookFor,
  examTip,
  commonTrap
} = {}) {
  return createNote({
    style: NOTE_STYLES.EXAM_LENS,
    data: {
      skill,
      whatToLookFor,
      examTip,
      commonTrap
    }
  });
}


/**
 * Select suitable note styles for a lesson category.
 *
 * This is deliberately rule-based rather than random.
 */
function getRecommendedStyles(category) {
  const recommendations = {
    passage: [
      NOTE_STYLES.LOOK_CLOSER,
      NOTE_STYLES.EXAM_LENS,
      NOTE_STYLES.DETECTIVE
    ],

    vocabulary: [
      NOTE_STYLES.MEMORY_TRICK,
      NOTE_STYLES.REAL_LIFE,
      NOTE_STYLES.TRAP_CARD
    ],

    dialogue: [
      NOTE_STYLES.REAL_LIFE,
      NOTE_STYLES.FUNNY_NOTE,
      NOTE_STYLES.LOOK_CLOSER
    ],

    grammar: [
      NOTE_STYLES.RULE_CARD,
      NOTE_STYLES.TRAP_CARD,
      NOTE_STYLES.BUILD_IT,
      NOTE_STYLES.MEMORY_TRICK
    ],

    sentence: [
      NOTE_STYLES.BUILD_IT,
      NOTE_STYLES.LOOK_CLOSER,
      NOTE_STYLES.TRAP_CARD
    ],

    coherence: [
      NOTE_STYLES.BUILD_IT,
      NOTE_STYLES.LOOK_CLOSER,
      NOTE_STYLES.EXAM_LENS
    ],

    writing: [
      NOTE_STYLES.BUILD_IT,
      NOTE_STYLES.RULE_CARD,
      NOTE_STYLES.EXAM_LENS
    ]
  };

  return recommendations[category] || [
    NOTE_STYLES.RULE_CARD,
    NOTE_STYLES.MEMORY_TRICK,
    NOTE_STYLES.EXAM_LENS
  ];
}


/**
 * Return a suitable note style while avoiding
 * recently used styles when possible.
 */
function chooseNoteStyle({
  category,
  previousStyles = []
} = {}) {
  const recommended = getRecommendedStyles(category);

  const fresh = recommended.filter(
    (style) => !previousStyles.includes(style)
  );

  if (fresh.length > 0) {
    return fresh[0];
  }

  return recommended[0];
}


/**
 * Internal value validation.
 */
function isNonEmptyValue(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
}


module.exports = {
  NOTE_STYLES,
  NOTE_DEFINITIONS,

  createNote,
  getNoteDefinition,
  getNoteStyles,
  isValidStyle,
  validateNote,

  createRuleCard,
  createMemoryTrick,
  createTrapCard,
  createLookCloser,
  createBuildIt,
  createFunnyNote,
  createRealLifeConnection,
  createExamLens,

  getRecommendedStyles,
  chooseNoteStyle
};
