const ENGLISH_SKILLS = {
  passage: {
    id: "passage",
    title: "📖 Passage Skills",
    skills: [
      {
        id: "main-idea",
        title: "Main Idea",
        examFocus: "Identify the central idea of a passage or paragraph.",
      },
      {
        id: "specific-information",
        title: "Specific Information",
        examFocus: "Find details directly supported by the passage.",
      },
      {
        id: "skimming",
        title: "Skimming",
        examFocus: "Quickly identify the general idea of a text.",
      },
      {
        id: "scanning",
        title: "Scanning",
        examFocus: "Locate specific information quickly.",
      },
      {
        id: "inference",
        title: "Inference",
        examFocus: "Understand ideas that are implied rather than directly stated.",
      },
      {
        id: "context-understanding",
        title: "Context Understanding",
        examFocus: "Use surrounding information to understand meaning.",
      },
      {
        id: "verbal-reasoning",
        title: "Verbal Reasoning",
        examFocus: "Solve reasoning questions using language and relationships.",
      },
      {
        id: "paragraph-organization",
        title: "Paragraph Organization",
        examFocus: "Recognize how ideas are arranged within a paragraph.",
      },
    ],
  },

  vocabulary: {
    id: "vocabulary",
    title: "🧠 Vocabulary",
    skills: [
      {
        id: "meaning-from-context",
        title: "Meaning from Context",
        examFocus: "Determine the meaning of a word from its surrounding context.",
      },
      {
        id: "synonyms",
        title: "Synonyms",
        examFocus: "Identify words with similar meanings.",
      },
      {
        id: "antonyms",
        title: "Antonyms",
        examFocus: "Identify words with opposite meanings.",
      },
      {
        id: "word-formation",
        title: "Word Formation",
        examFocus: "Choose or form the appropriate word for a context.",
      },
      {
        id: "prefixes-and-suffixes",
        title: "Prefixes & Suffixes",
        examFocus: "Use word parts to understand or form words.",
      },
      {
        id: "phrasal-verbs",
        title: "Phrasal Verbs",
        examFocus: "Understand and use common phrasal verbs in context.",
      },
      {
        id: "common-expressions",
        title: "Common Expressions",
        examFocus: "Recognize appropriate expressions in context.",
      },
      {
        id: "word-relationships",
        title: "Word Relationships",
        examFocus: "Recognize relationships such as synonym, antonym, cause/effect, whole/part, and thing/function.",
      },
    ],
  },

  dialogue: {
    id: "dialogue",
    title: "💬 Dialogue & Communication",
    skills: [
      {
        id: "complete-dialogue",
        title: "Completing Dialogues",
        examFocus: "Choose language that logically completes a conversation.",
      },
      {
        id: "appropriate-response",
        title: "Appropriate Responses",
        examFocus: "Select a natural response for a given situation.",
      },
      {
        id: "asking-opinions",
        title: "Asking for Opinions",
        examFocus: "Recognize appropriate ways to ask for someone's opinion.",
      },
      {
        id: "giving-opinions",
        title: "Giving Opinions",
        examFocus: "Choose suitable expressions for giving opinions.",
      },
      {
        id: "agreement-disagreement",
        title: "Agreement & Disagreement",
        examFocus: "Recognize appropriate agreement and disagreement expressions.",
      },
      {
        id: "conversation-understanding",
        title: "Understanding Conversations",
        examFocus: "Identify meaning, intention, and information in dialogue.",
      },
    ],
  },

  grammar: {
    id: "grammar",
    title: "✏️ Grammar",
    skills: [
      {
        id: "tenses",
        title: "Tenses",
        examFocus: "Choose the correct tense according to meaning and context.",
      },
      {
        id: "conditionals",
        title: "Conditionals",
        examFocus: "Recognize and use conditional structures.",
      },
      {
        id: "passive-voice",
        title: "Passive Voice",
        examFocus: "Recognize and form passive structures.",
      },
      {
        id: "subject-verb-agreement",
        title: "Subject–Verb Agreement",
        examFocus: "Match verbs correctly with their subjects.",
      },
      {
        id: "relative-words",
        title: "Relative Words",
        examFocus: "Use appropriate relative words in sentences.",
      },
      {
        id: "gerunds-infinitives-participles",
        title: "Gerunds, Infinitives & Participles",
        examFocus: "Recognize and use verbal forms correctly.",
      },
      {
        id: "comparison",
        title: "Comparison",
        examFocus: "Use appropriate forms and expressions of comparison.",
      },
      {
        id: "modals",
        title: "Modals",
        examFocus: "Choose modal forms according to meaning and context.",
      },
      {
        id: "sentence-structure",
        title: "Sentence Structure",
        examFocus: "Identify and construct grammatically correct sentences.",
      },
      {
        id: "discourse-markers",
        title: "Discourse Markers",
        examFocus: "Connect ideas using appropriate linking expressions.",
      },
      {
        id: "sentence-fragments",
        title: "Sentence Fragments",
        examFocus: "Identify and correct incomplete sentences.",
      },
    ],
  },

  coherence: {
    id: "coherence",
    title: "🧩 Sentence & Coherence",
    skills: [
      {
        id: "sentence-completion",
        title: "Sentence Completion",
        examFocus: "Choose words or structures that logically complete a sentence.",
      },
      {
        id: "rearranging-sentences",
        title: "Rearranging Sentences",
        examFocus: "Put sentences into a logical order.",
      },
      {
        id: "logical-relationships",
        title: "Logical Relationships",
        examFocus: "Identify how ideas connect with one another.",
      },
      {
        id: "coherence",
        title: "Coherence",
        examFocus: "Recognize whether ideas flow logically.",
      },
      {
        id: "linking-ideas",
        title: "Linking Ideas",
        examFocus: "Choose language that connects ideas clearly.",
      },
      {
        id: "paragraph-organization",
        title: "Paragraph Organization",
        examFocus: "Identify introduction, supporting ideas, development, and conclusion.",
      },
    ],
  },

  writing: {
    id: "writing",
    title: "📝 Writing",
    skills: [
      {
        id: "topic-sentence",
        title: "Topic Sentences",
        examFocus: "Identify or construct the main sentence of a paragraph.",
      },
      {
        id: "supporting-ideas",
        title: "Supporting Ideas",
        examFocus: "Recognize details that develop the main idea.",
      },
      {
        id: "paragraph-structure",
        title: "Paragraph Structure",
        examFocus: "Understand how a well-organized paragraph is built.",
      },
      {
        id: "conclusion",
        title: "Conclusions",
        examFocus: "Recognize an effective closing idea.",
      },
      {
        id: "comparison-contrast",
        title: "Comparing & Contrasting",
        examFocus: "Organize ideas to show similarities and differences.",
      },
      {
        id: "summary-writing",
        title: "Summary Writing",
        examFocus: "Express the essential ideas of a text concisely.",
      },
      {
        id: "essay-organization",
        title: "Essay Organization",
        examFocus: "Understand introduction, thesis, supporting paragraphs, and conclusion.",
      },
    ],
  },
};

function getSkillCategories() {
  return Object.values(ENGLISH_SKILLS);
}

function getSkillsByCategory(categoryId) {
  const category = Object.values(ENGLISH_SKILLS).find(
    (item) => item.id === categoryId
  );

  return category ? category.skills : [];
}

function findSkill(skillId) {
  for (const category of Object.values(ENGLISH_SKILLS)) {
    const skill = category.skills.find(
      (item) => item.id === skillId
    );

    if (skill) {
      return {
        category: category.id,
        categoryTitle: category.title,
        skill,
      };
    }
  }

  return null;
}

module.exports = {
  ENGLISH_SKILLS,
  getSkillCategories,
  getSkillsByCategory,
  findSkill,
};
