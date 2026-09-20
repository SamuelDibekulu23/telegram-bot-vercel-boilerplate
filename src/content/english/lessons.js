const ENGLISH_LESSONS = [
  // ==========================================
  // PASSAGE SKILLS
  // ==========================================

  {
    id: "eng-passage-main-idea",
    category: "passage",
    skillId: "main-idea",
    title: "Find the Main Idea",
    shortTitle: "Main Idea",
    difficulty: "easy",
  },

  {
    id: "eng-passage-details",
    category: "passage",
    skillId: "specific-information",
    title: "Find the Answer Hiding in the Passage",
    shortTitle: "Specific Information",
    difficulty: "easy",
  },

  {
    id: "eng-passage-skimming",
    category: "passage",
    skillId: "skimming",
    title: "Read Less, Understand More",
    shortTitle: "Skimming",
    difficulty: "easy",
  },

  {
    id: "eng-passage-scanning",
    category: "passage",
    skillId: "scanning",
    title: "Hunt for the Exact Detail",
    shortTitle: "Scanning",
    difficulty: "easy",
  },

  {
    id: "eng-passage-inference",
    category: "passage",
    skillId: "inference",
    title: "The Passage Didn't Say It — But It Did",
    shortTitle: "Inference",
    difficulty: "medium",
  },

  {
    id: "eng-passage-context",
    category: "passage",
    skillId: "context-understanding",
    title: "Read Between the Lines",
    shortTitle: "Context Understanding",
    difficulty: "medium",
  },

  {
    id: "eng-passage-reasoning",
    category: "passage",
    skillId: "verbal-reasoning",
    title: "Think Like the Question Writer",
    shortTitle: "Verbal Reasoning",
    difficulty: "medium",
  },

  {
    id: "eng-passage-organization",
    category: "passage",
    skillId: "paragraph-organization",
    title: "Where Does This Idea Belong?",
    shortTitle: "Paragraph Organization",
    difficulty: "medium",
  },

  // ==========================================
  // VOCABULARY
  // ==========================================

  {
    id: "eng-vocab-context",
    category: "vocabulary",
    skillId: "meaning-from-context",
    title: "Know the Word Without Knowing the Word",
    shortTitle: "Meaning from Context",
    difficulty: "easy",
  },

  {
    id: "eng-vocab-synonyms",
    category: "vocabulary",
    skillId: "synonyms",
    title: "Same Meaning, Different Outfit",
    shortTitle: "Synonyms",
    difficulty: "easy",
  },

  {
    id: "eng-vocab-antonyms",
    category: "vocabulary",
    skillId: "antonyms",
    title: "Find the Meaning's Opposite",
    shortTitle: "Antonyms",
    difficulty: "easy",
  },

  {
    id: "eng-vocab-word-formation",
    category: "vocabulary",
    skillId: "word-formation",
    title: "Build the Right Word",
    shortTitle: "Word Formation",
    difficulty: "medium",
  },

  {
    id: "eng-vocab-affixes",
    category: "vocabulary",
    skillId: "prefixes-and-suffixes",
    title: "Tiny Word Parts, Big Meaning",
    shortTitle: "Prefixes & Suffixes",
    difficulty: "medium",
  },

  {
    id: "eng-vocab-phrasal-verbs",
    category: "vocabulary",
    skillId: "phrasal-verbs",
    title: "Two Words Walk Into a Verb",
    shortTitle: "Phrasal Verbs",
    difficulty: "medium",
  },

  {
    id: "eng-vocab-expressions",
    category: "vocabulary",
    skillId: "common-expressions",
    title: "What Would You Actually Say?",
    shortTitle: "Common Expressions",
    difficulty: "easy",
  },

  {
    id: "eng-vocab-relationships",
    category: "vocabulary",
    skillId: "word-relationships",
    title: "Connect the Words",
    shortTitle: "Word Relationships",
    difficulty: "medium",
  },

  // ==========================================
  // DIALOGUE & COMMUNICATION
  // ==========================================

  {
    id: "eng-dialogue-complete",
    category: "dialogue",
    skillId: "complete-dialogue",
    title: "Finish the Conversation",
    shortTitle: "Completing Dialogues",
    difficulty: "easy",
  },

  {
    id: "eng-dialogue-response",
    category: "dialogue",
    skillId: "appropriate-response",
    title: "Say the Right Thing",
    shortTitle: "Appropriate Responses",
    difficulty: "easy",
  },

  {
    id: "eng-dialogue-opinion-ask",
    category: "dialogue",
    skillId: "asking-opinions",
    title: "How Do You Ask What Someone Thinks?",
    shortTitle: "Asking for Opinions",
    difficulty: "easy",
  },

  {
    id: "eng-dialogue-opinion-give",
    category: "dialogue",
    skillId: "giving-opinions",
    title: "Give Your Opinion Naturally",
    shortTitle: "Giving Opinions",
    difficulty: "easy",
  },

  {
    id: "eng-dialogue-agreement",
    category: "dialogue",
    skillId: "agreement-disagreement",
    title: "Agree, Disagree, Don't Sound Lost",
    shortTitle: "Agreement & Disagreement",
    difficulty: "medium",
  },

  {
    id: "eng-dialogue-understanding",
    category: "dialogue",
    skillId: "conversation-understanding",
    title: "Catch What They Really Mean",
    shortTitle: "Conversation Understanding",
    difficulty: "medium",
  },

  // ==========================================
  // GRAMMAR
  // ==========================================

  {
    id: "eng-grammar-tenses",
    category: "grammar",
    skillId: "tenses",
    title: "The Time Machine: Tenses",
    shortTitle: "Tenses",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-conditionals",
    category: "grammar",
    skillId: "conditionals",
    title: "If This Happens...",
    shortTitle: "Conditionals",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-passive",
    category: "grammar",
    skillId: "passive-voice",
    title: "Who Did It? Passive Voice",
    shortTitle: "Passive Voice",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-agreement",
    category: "grammar",
    skillId: "subject-verb-agreement",
    title: "Make the Subject and Verb Agree",
    shortTitle: "Subject–Verb Agreement",
    difficulty: "easy",
  },

  {
    id: "eng-grammar-relative",
    category: "grammar",
    skillId: "relative-words",
    title: "Which Word Connects Them?",
    shortTitle: "Relative Words",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-verbal",
    category: "grammar",
    skillId: "gerunds-infinitives-participles",
    title: "Gerund, Infinitive or Participle?",
    shortTitle: "Verbal Forms",
    difficulty: "hard",
  },

  {
    id: "eng-grammar-comparison",
    category: "grammar",
    skillId: "comparison",
    title: "More, Less, Better... Wait",
    shortTitle: "Comparison",
    difficulty: "easy",
  },

  {
    id: "eng-grammar-modals",
    category: "grammar",
    skillId: "modals",
    title: "Can, Could, Should, Must",
    shortTitle: "Modals",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-structure",
    category: "grammar",
    skillId: "sentence-structure",
    title: "Build a Sentence That Actually Works",
    shortTitle: "Sentence Structure",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-discourse",
    category: "grammar",
    skillId: "discourse-markers",
    title: "Connect the Dots",
    shortTitle: "Discourse Markers",
    difficulty: "medium",
  },

  {
    id: "eng-grammar-fragments",
    category: "grammar",
    skillId: "sentence-fragments",
    title: "This Sentence Is Missing Something",
    shortTitle: "Sentence Fragments",
    difficulty: "easy",
  },

  // ==========================================
  // SENTENCE & COHERENCE
  // ==========================================

  {
    id: "eng-coherence-completion",
    category: "coherence",
    skillId: "sentence-completion",
    title: "Complete the Thought",
    shortTitle: "Sentence Completion",
    difficulty: "easy",
  },

  {
    id: "eng-coherence-rearrange",
    category: "coherence",
    skillId: "rearranging-sentences",
    title: "Put the Pieces Back Together",
    shortTitle: "Rearranging Sentences",
    difficulty: "medium",
  },

  {
    id: "eng-coherence-logic",
    category: "coherence",
    skillId: "logical-relationships",
    title: "What Connects These Ideas?",
    shortTitle: "Logical Relationships",
    difficulty: "medium",
  },

  {
    id: "eng-coherence-flow",
    category: "coherence",
    skillId: "coherence",
    title: "Make the Ideas Flow",
    shortTitle: "Coherence",
    difficulty: "medium",
  },

  {
    id: "eng-coherence-linking",
    category: "coherence",
    skillId: "linking-ideas",
    title: "The Words That Hold Ideas Together",
    shortTitle: "Linking Ideas",
    difficulty: "medium",
  },

  {
    id: "eng-coherence-paragraph",
    category: "coherence",
    skillId: "paragraph-organization",
    title: "Build the Paragraph",
    shortTitle: "Paragraph Organization",
    difficulty: "medium",
  },

  // ==========================================
  // WRITING
  // ==========================================

  {
    id: "eng-writing-topic",
    category: "writing",
    skillId: "topic-sentence",
    title: "Find the Sentence in Charge",
    shortTitle: "Topic Sentences",
    difficulty: "easy",
  },

  {
    id: "eng-writing-support",
    category: "writing",
    skillId: "supporting-ideas",
    title: "Give the Main Idea Backup",
    shortTitle: "Supporting Ideas",
    difficulty: "easy",
  },

  {
    id: "eng-writing-paragraph",
    category: "writing",
    skillId: "paragraph-structure",
    title: "Build a Strong Paragraph",
    shortTitle: "Paragraph Structure",
    difficulty: "medium",
  },

  {
    id: "eng-writing-conclusion",
    category: "writing",
    skillId: "conclusion",
    title: "End It Without Just Stopping",
    shortTitle: "Conclusions",
    difficulty: "medium",
  },

  {
    id: "eng-writing-compare",
    category: "writing",
    skillId: "comparison-contrast",
    title: "Compare Without Getting Lost",
    shortTitle: "Compare & Contrast",
    difficulty: "medium",
  },

  {
    id: "eng-writing-summary",
    category: "writing",
    skillId: "summary-writing",
    title: "Say More With Fewer Words",
    shortTitle: "Summary Writing",
    difficulty: "medium",
  },

  {
    id: "eng-writing-essay",
    category: "writing",
    skillId: "essay-organization",
    title: "Build an Essay That Makes Sense",
    shortTitle: "Essay Organization",
    difficulty: "hard",
  },
];

function getEnglishLessons() {
  return [...ENGLISH_LESSONS];
}

function getLessonsByCategory(categoryId) {
  return ENGLISH_LESSONS.filter(
    (lesson) => lesson.category === categoryId
  );
}

function getLessonsBySkill(skillId) {
  return ENGLISH_LESSONS.filter(
    (lesson) => lesson.skillId === skillId
  );
}

function getLessonById(lessonId) {
  return (
    ENGLISH_LESSONS.find(
      (lesson) => lesson.id === lessonId
    ) || null
  );
}

module.exports = {
  ENGLISH_LESSONS,
  getEnglishLessons,
  getLessonsByCategory,
  getLessonsBySkill,
  getLessonById,
};
