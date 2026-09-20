/**
 * FineBot English Lesson Templates
 *
 * Purpose:
 * Controls HOW an English lesson is presented.
 *
 * Content = what the student learns.
 * Templates = how FineBot presents it.
 *
 * Templates are selected by the Lesson Engine later.
 */

const TEMPLATES = {
  detective: {
    id: "detective",
    name: "Detective",
    emoji: "🕵️",
    description: "Investigate clues until the answer becomes clear.",
    bestFor: [
      "passage",
      "vocabulary",
      "coherence",
      "inference"
    ],
    difficulty: ["medium", "hard"],
    style: "investigative",
    energy: "high",
    structure: [
      "hook",
      "clue",
      "investigation",
      "micro_check",
      "reveal"
    ]
  },

  grammar_rescue: {
    id: "grammar-rescue",
    name: "Grammar Rescue",
    emoji: "🚨",
    description: "Find what is going wrong and repair it.",
    bestFor: [
      "grammar",
      "sentence"
    ],
    difficulty: ["easy", "medium", "hard"],
    style: "problem_solving",
    energy: "medium",
    structure: [
      "problem",
      "rule",
      "example",
      "micro_check",
      "repair"
    ]
  },

  puzzle: {
    id: "puzzle",
    name: "Puzzle",
    emoji: "🧩",
    description: "Build the answer piece by piece.",
    bestFor: [
      "coherence",
      "grammar",
      "vocabulary",
      "sentence"
    ],
    difficulty: ["easy", "medium", "hard"],
    style: "step_by_step",
    energy: "medium",
    structure: [
      "challenge",
      "pieces",
      "connection",
      "micro_check",
      "solution"
    ]
  },

  target_practice: {
    id: "target-practice",
    name: "Target Practice",
    emoji: "🎯",
    description: "Focus on one specific exam skill at a time.",
    bestFor: [
      "grammar",
      "vocabulary",
      "passage",
      "coherence"
    ],
    difficulty: ["easy", "medium", "hard"],
    style: "focused",
    energy: "medium",
    structure: [
      "target",
      "rule",
      "example",
      "quick_shot",
      "result"
    ]
  },

  spot_the_trap: {
    id: "spot-the-trap",
    name: "Spot the Trap",
    emoji: "⚠️",
    description: "Learn why an attractive answer can still be wrong.",
    bestFor: [
      "grammar",
      "vocabulary",
      "passage",
      "sentence"
    ],
    difficulty: ["medium", "hard"],
    style: "trap_detection",
    energy: "high",
    structure: [
      "trap",
      "why_it_looks_right",
      "warning",
      "micro_check",
      "correct_choice"
    ]
  },

  speed_round: {
    id: "speed-round",
    name: "Speed Round",
    emoji: "⚡",
    description: "A short focused challenge with quick decisions.",
    bestFor: [
      "grammar",
      "vocabulary",
      "dialogue",
      "sentence"
    ],
    difficulty: ["easy", "medium"],
    style: "fast",
    energy: "high",
    structure: [
      "challenge",
      "quick_rule",
      "example",
      "speed_check",
      "finish"
    ]
  },

  memory_trick: {
    id: "memory-trick",
    name: "Memory Trick",
    emoji: "🧠",
    description: "Turn a difficult idea into something easier to remember.",
    bestFor: [
      "grammar",
      "vocabulary",
      "coherence"
    ],
    difficulty: ["easy", "medium", "hard"],
    style: "memory",
    energy: "low",
    structure: [
      "concept",
      "memory_hook",
      "example",
      "micro_check",
      "recall"
    ]
  },

  real_conversation: {
    id: "real-conversation",
    name: "Real Conversation",
    emoji: "💬",
    description: "Learn English through situations people actually say.",
    bestFor: [
      "dialogue",
      "vocabulary",
      "grammar"
    ],
    difficulty: ["easy", "medium"],
    style: "conversation",
    energy: "medium",
    structure: [
      "scene",
      "conversation",
      "language_point",
      "micro_check",
      "response"
    ]
  },

  passage_investigation: {
    id: "passage-investigation",
    name: "Passage Investigation",
    emoji: "🔎",
    description: "Break a passage into manageable clues.",
    bestFor: [
      "passage",
      "reading",
      "inference"
    ],
    difficulty: ["medium", "hard"],
    style: "reading_investigation",
    energy: "medium",
    structure: [
      "passage_hook",
      "reading_clue",
      "evidence",
      "micro_check",
      "answer"
    ]
  },

  sentence_workshop: {
    id: "sentence-workshop",
    name: "Sentence Workshop",
    emoji: "🔧",
    description: "Build, repair and improve sentences.",
    bestFor: [
      "sentence",
      "grammar",
      "coherence"
    ],
    difficulty: ["easy", "medium", "hard"],
    style: "construction",
    energy: "medium",
    structure: [
      "sentence",
      "parts",
      "rule",
      "micro_check",
      "finished_sentence"
    ]
  },

  mini_scene: {
    id: "mini-scene",
    name: "Mini Scene",
    emoji: "🎬",
    description: "Put the language inside a tiny memorable situation.",
    bestFor: [
      "dialogue",
      "vocabulary",
      "grammar"
    ],
    difficulty: ["easy", "medium"],
    style: "story_scene",
    energy: "high",
    structure: [
      "scene",
      "language_problem",
      "explanation",
      "micro_check",
      "scene_result"
    ]
  },

  escape_the_mistake: {
    id: "escape-the-mistake",
    name: "Escape the Mistake",
    emoji: "🚪",
    description: "Recognize a common mistake and escape it.",
    bestFor: [
      "grammar",
      "sentence",
      "vocabulary"
    ],
    difficulty: ["medium", "hard"],
    style: "mistake_recovery",
    energy: "high",
    structure: [
      "mistake",
      "why",
      "fix",
      "micro_check",
      "escape"
    ]
  },

  build_it: {
    id: "build-it",
    name: "Build It",
    emoji: "🏗️",
    description: "Construct the correct answer from simple pieces.",
    bestFor: [
      "grammar",
      "sentence",
      "writing",
      "coherence"
    ],
    difficulty: ["easy", "medium"],
    style: "construction",
    energy: "medium",
    structure: [
      "starting_point",
      "piece_one",
      "piece_two",
      "micro_check",
      "complete"
    ]
  },

  mystery_question: {
    id: "mystery-question",
    name: "Mystery Question",
    emoji: "❓",
    description: "Start with a curious question and uncover the answer.",
    bestFor: [
      "passage",
      "vocabulary",
      "grammar",
      "inference"
    ],
    difficulty: ["medium", "hard"],
    style: "curiosity",
    energy: "high",
    structure: [
      "mystery",
      "clue",
      "concept",
      "micro_check",
      "reveal"
    ]
  },

  language_experiment: {
    id: "language-experiment",
    name: "Language Experiment",
    emoji: "🧪",
    description: "Change one part of a sentence and observe what happens.",
    bestFor: [
      "grammar",
      "sentence",
      "coherence"
    ],
    difficulty: ["medium", "hard"],
    style: "experimental",
    energy: "medium",
    structure: [
      "original",
      "change",
      "observe",
      "micro_check",
      "rule"
    ]
  },

  wait_why: {
    id: "wait-why",
    name: "Wait... Why?",
    emoji: "👀",
    description: "Explore a confusing English rule that looks strange at first.",
    bestFor: [
      "grammar",
      "vocabulary",
      "sentence"
    ],
    difficulty: ["medium", "hard"],
    style: "curiosity",
    energy: "medium",
    structure: [
      "surprise",
      "question",
      "explanation",
      "micro_check",
      "aha"
    ]
  }
};


/**
 * Return every available template.
 */
function getTemplates() {
  return Object.values(TEMPLATES);
}


/**
 * Find one template by ID.
 */
function getTemplateById(templateId) {
  return TEMPLATES[templateId] || null;
}


/**
 * Return templates suitable for a specific skill category.
 */
function getTemplatesForCategory(category) {
  return getTemplates().filter((template) =>
    template.bestFor.includes(category)
  );
}


/**
 * Return templates suitable for a difficulty level.
 */
function getTemplatesForDifficulty(difficulty) {
  return getTemplates().filter((template) =>
    template.difficulty.includes(difficulty)
  );
}


/**
 * Return templates suitable for both category and difficulty.
 */
function getMatchingTemplates(category, difficulty) {
  return getTemplates().filter((template) =>
    template.bestFor.includes(category) &&
    template.difficulty.includes(difficulty)
  );
}


/**
 * Choose a suitable template.
 *
 * Important:
 * This is NOT random.
 *
 * The future Lesson Engine can pass:
 * - category
 * - difficulty
 * - previousTemplates
 * - lessonPosition
 * - studentPerformance
 *
 * For now we simply return the first suitable template.
 * The selection intelligence will be added later
 * when the Lesson Engine exists.
 */
function chooseTemplate({
  category,
  difficulty,
  previousTemplates = []
}) {
  let candidates = getMatchingTemplates(category, difficulty);

  if (candidates.length === 0) {
    candidates = getTemplatesForCategory(category);
  }

  if (candidates.length === 0) {
    candidates = getTemplatesForDifficulty(difficulty);
  }

  if (candidates.length === 0) {
    candidates = getTemplates();
  }

  // Prefer templates the student has not recently experienced.
  const freshCandidates = candidates.filter(
    (template) => !previousTemplates.includes(template.id)
  );

  if (freshCandidates.length > 0) {
    return freshCandidates[0];
  }

  return candidates[0];
}


module.exports = {
  TEMPLATES,
  getTemplates,
  getTemplateById,
  getTemplatesForCategory,
  getTemplatesForDifficulty,
  getMatchingTemplates,
  chooseTemplate
};
