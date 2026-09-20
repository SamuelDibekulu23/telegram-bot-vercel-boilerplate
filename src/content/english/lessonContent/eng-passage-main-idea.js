/**
 * FineBot English Lesson Content
 *
 * Lesson:
 * Find the Main Idea
 *
 * Category:
 * Passage
 *
 * Skill:
 * Main Idea
 *
 * Academic basis:
 * Grade 10 and Grade 12 English textbook reading objectives
 * involving gist, main idea, skimming and distinguishing
 * main ideas from supporting details.
 *
 * Important:
 * The instructional examples in this file are newly authored.
 * They are NOT previous examination questions.
 *
 * No fake examination question is included.
 */


const {
  createLessonContent,
  createConcept,
  createExample,
  createMicroCheck,
  createIntroduction,
  createCompletion
} = require("../lessonContent");


const LESSON_ID = "eng-passage-main-idea";


/*
|--------------------------------------------------------------------------
| INTRODUCTION
|--------------------------------------------------------------------------
*/

const introduction = createIntroduction({
  hook:
    "A passage can contain many details, but there is usually one big idea " +
    "holding them together. Your mission is to find it without getting " +
    "trapped by the noisy little details.",

  goal:
    "Learn to identify the main idea of a passage and distinguish it " +
    "from supporting details.",

  quickStart:
    "Think of a passage like a movie. The main idea is what the whole " +
    "movie is about. The details are the individual scenes that help " +
    "tell the story."
});


/*
|--------------------------------------------------------------------------
| CONCEPT 1
|--------------------------------------------------------------------------
| What the main idea actually means.
*/

const concept1 = createConcept({
  id: "eng-passage-main-idea-concept-1",

  title:
    "What Is the Main Idea?",

  explanation:
    "The main idea is the central point or most important message " +
    "of a passage. It tells you what the passage is mainly about " +
    "and what the writer wants you to understand.",

  noteStyle:
    "rule_card",

  note: {
    title:
      "RULE CARD",

    content:
      "Ask yourself: What is this passage mainly trying to tell me?"
  },

  analogy:
    "Imagine a tree. The main idea is the trunk. " +
    "The branches, leaves and fruits are the supporting details " +
    "connected to it.",

  example: {
    prompt:
      "Many students use their phones to communicate, study and find " +
      "information. Educational applications can provide lessons, " +
      "dictionaries and practice activities. When used wisely, " +
      "smartphones can therefore support learning.",

    answer:
      "Smartphones can support learning when used wisely.",

    explanation:
      "Communication, study, information and educational applications " +
      "are details supporting the broader idea that smartphones can " +
      "support learning when used wisely.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "What is the main idea of the smartphone passage?",

    options: [
      "Students use phones to communicate.",
      "Educational applications provide dictionaries.",
      "Smartphones can support learning when used wisely.",
      "Students use phones to find information."
    ],

    correctAnswer:
      2,

    feedback:
      "The third answer covers the whole passage. " +
      "The other choices are individual details."
  }
});


/*
|--------------------------------------------------------------------------
| CONCEPT 2
|--------------------------------------------------------------------------
| Main idea versus supporting detail.
*/

const concept2 = createConcept({
  id: "eng-passage-main-idea-concept-2",

  title:
    "Main Idea vs. Supporting Detail",

  explanation:
    "A supporting detail gives information about the main idea. " +
    "It may be a fact, example, reason or specific piece of information. " +
    "A detail can be important without being the main idea.",

  noteStyle:
    "trap_card",

  note: {
    title:
      "WATCH THE TRAP",

    content:
      "A specific answer may appear directly in the passage and still " +
      "be wrong. If it covers only one small part, it is probably " +
      "a supporting detail."
  },

  analogy:
    "Think about a football team. The main idea is the overall game " +
    "plan. Individual passes and shots matter, but one pass is not " +
    "the whole plan.",

  example: {
    prompt:
      "Regular exercise can benefit students in several ways. " +
      "It can improve physical fitness, help reduce stress and support " +
      "better sleep. Even a short daily walk can become part of " +
      "a healthy routine.",

    answer:
      "Regular exercise provides several benefits for students.",

    explanation:
      "A short daily walk or better sleep is only one detail. " +
      "The broader message is about the several benefits of exercise.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which statement is a supporting detail rather than the main idea?",

    options: [
      "Regular exercise can benefit students in several ways.",
      "Exercise can support better sleep.",
      "Exercise can improve student wellbeing.",
      "Regular exercise has several benefits."
    ],

    correctAnswer:
      1,

    feedback:
      "Better sleep is one specific benefit, so it supports the " +
      "broader main idea."
  }
});


/*
|--------------------------------------------------------------------------
| CONCEPT 3
|--------------------------------------------------------------------------
| Finding an implied main idea.
|--------------------------------------------------------------------------
*/

const concept3 = createConcept({
  id: "eng-passage-main-idea-concept-3",

  title:
    "Use the Whole Passage",

  explanation:
    "Sometimes the main idea is stated clearly. Sometimes you must " +
    "combine information from several sentences. Read the passage " +
    "as a whole before choosing the answer.",

  noteStyle:
    "look_closer",

  note: {
    title:
      "LOOK CLOSER",

    content:
      "When the main idea is not directly stated, collect the important " +
      "details first. Then ask what common idea connects them."
  },

  analogy:
    "It is like listening to someone tell a story. You would not decide " +
    "what the story means after hearing only the first sentence.",

  example: {
    prompt:
      "A student prepares for an examination by dividing study time " +
      "into smaller sessions. She reviews difficult topics first, " +
      "takes short breaks and checks her mistakes after practice. " +
      "After several weeks, she notices that she remembers more " +
      "and feels less overwhelmed.",

    answer:
      "Organized study habits can improve learning and reduce overwhelm.",

    explanation:
      "The passage combines several study habits and their results. " +
      "The main idea connects those details.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "What is the best main idea for the study passage?",

    options: [
      "The student takes short breaks.",
      "The student reviews difficult topics first.",
      "Organized study habits can improve learning and reduce overwhelm.",
      "The student practices for several weeks."
    ],

    correctAnswer:
      2,

    feedback:
      "The third answer brings the different details together."
  }
});


/*
|--------------------------------------------------------------------------
| CONCEPT 4
|--------------------------------------------------------------------------
| Skimming for overall meaning.
|--------------------------------------------------------------------------
*/

const concept4 = createConcept({
  id: "eng-passage-main-idea-concept-4",

  title:
    "Skim Before You Decide",

  explanation:
    "Skimming means reading quickly to understand the general idea " +
    "rather than examining every word. For a main-idea question, " +
    "skimming can help you see the overall direction of the passage " +
    "before focusing on details.",

  noteStyle:
    "memory_trick",

  note: {
    title:
      "MEMORY TRICK",

    content:
      "MAIN = Mostly About + Important message + Not one tiny detail."
  },

  analogy:
    "Imagine looking at a map before starting a journey. " +
    "You do not need to memorize every street to know where you are going.",

  example: {
    prompt:
      "Before answering a main-idea question, quickly notice what " +
      "the passage starts with, what ideas keep appearing and where " +
      "the passage seems to be heading.",

    answer:
      "Build an overall picture before choosing the answer.",

    explanation:
      "The first read does not require memorizing every sentence. " +
      "It helps you understand the passage's direction.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "What is skimming mainly useful for when answering a main-idea question?",

    options: [
      "Memorizing every word",
      "Understanding the general direction of the passage",
      "Finding one exact number",
      "Ignoring the passage completely"
    ],

    correctAnswer:
      1,

    feedback:
      "Skimming helps you understand the overall idea before examining " +
      "specific details."
  }
});


/*
|--------------------------------------------------------------------------
| CONCEPT 5
|--------------------------------------------------------------------------
| Choosing the strongest answer.
|--------------------------------------------------------------------------
*/

const concept5 = createConcept({
  id: "eng-passage-main-idea-concept-5",

  title:
    "Choose the Right Answer",

  explanation:
    "A strong main-idea answer should be accurate, broad enough " +
    "to cover the passage and specific enough to express its central point. " +
    "Avoid answers that are too narrow, too broad or unrelated.",

  noteStyle:
    "exam_lens",

  note: {
    title:
      "EXAM LENS",

    content:
      "When several choices look possible, test each one against " +
      "the whole passage. Ask: Does this answer explain most of what I read?"
  },

  analogy:
    "Think of adjusting a camera lens. Too close shows one detail. " +
    "Too far makes everything unclear. The correct answer gives you " +
    "the useful middle view.",

  example: {
    prompt:
      "A local school introduces a weekly reading period. Students " +
      "choose books at different levels, discuss what they read and " +
      "keep short reading journals. Teachers notice that students " +
      "gradually become more confident when discussing texts and " +
      "expressing ideas.",

    answer:
      "A structured reading program can build students' confidence " +
      "and communication skills.",

    explanation:
      "A strong answer connects the activities with the broader result " +
      "instead of selecting one small detail.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which answer best captures the main idea of the school reading passage?",

    options: [
      "Students keep reading journals.",
      "Teachers observe students.",
      "A structured reading program can build students' confidence and communication skills.",
      "Students choose books at different levels."
    ],

    correctAnswer:
      2,

    feedback:
      "The third answer covers the central message instead of focusing " +
      "on one detail."
  }
});


/*
|--------------------------------------------------------------------------
| ADDITIONAL APPLICATION PRACTICE
|--------------------------------------------------------------------------
|
| These are NOT official examination questions.
| They are original FineBot learning applications.
|--------------------------------------------------------------------------
*/

const applications = [

  {
    id:
      "eng-passage-main-idea-application-1",

    type:
      "multiple_choice",

    prompt:
      "A school creates a quiet reading area where students can read, " +
      "discuss books and write short reflections. The area helps students " +
      "develop regular reading habits and think more deeply about what " +
      "they read. What is the main idea?",

    options: [
      "Students write short reflections.",
      "The reading area helps develop stronger reading habits and thinking.",
      "Students discuss books.",
      "The school has a quiet area."
    ],

    correctAnswer:
      1,

    skill:
      "main-idea",

    conceptId:
      concept1.id,

    difficulty:
      "easy",

    feedback:
      "The second answer covers the purpose of the different details."
  },


  {
    id:
      "eng-passage-main-idea-application-2",

    type:
      "multiple_choice",

    prompt:
      "A community garden gives residents a place to grow vegetables, " +
      "meet neighbors and learn about plants. It also encourages people " +
      "to use an unused piece of land productively. Which option is " +
      "a supporting detail?",

    options: [
      "The garden provides several benefits to the community.",
      "The garden helps people use unused land productively.",
      "The project strengthens community life.",
      "Community gardens can improve local life."
    ],

    correctAnswer:
      1,

    skill:
      "main-idea",

    conceptId:
      concept2.id,

    difficulty:
      "medium",

    feedback:
      "Using unused land productively is one specific benefit described " +
      "in the passage."
  },


  {
    id:
      "eng-passage-main-idea-application-3",

    type:
      "multiple_choice",

    prompt:
      "A town improves its public spaces by planting trees, adding benches " +
      "and creating safer walking paths. Residents begin spending more time " +
      "outdoors and using the spaces to meet one another. What is the " +
      "best main idea?",

    options: [
      "The town planted trees.",
      "Residents use benches.",
      "Improved public spaces can make community areas more useful and enjoyable.",
      "People walk on safer paths."
    ],

    correctAnswer:
      2,

    skill:
      "main-idea",

    conceptId:
      concept3.id,

    difficulty:
      "medium",

    feedback:
      "The third answer connects the improvements with their broader effect."
  },


  {
    id:
      "eng-passage-main-idea-application-4",

    type:
      "multiple_choice",

    prompt:
      "You are given a long passage and asked for its main idea. " +
      "Which approach is most useful first?",

    options: [
      "Choose the longest answer immediately.",
      "Memorize every sentence before reading the choices.",
      "Skim the passage to understand its overall direction.",
      "Choose the first detail you notice."
    ],

    correctAnswer:
      2,

    skill:
      "main-idea",

    conceptId:
      concept4.id,

    difficulty:
      "medium",

    feedback:
      "Skimming gives you an overall picture before you decide."
  },


  {
    id:
      "eng-passage-main-idea-application-5",

    type:
      "multiple_choice",

    prompt:
      "A farmer begins recording rainfall, planting dates and crop growth. " +
      "After comparing the records over several seasons, the farmer adjusts " +
      "planting decisions and notices more consistent results. Which statement " +
      "best expresses the main idea?",

    options: [
      "The farmer records rainfall.",
      "The farmer changes planting dates.",
      "Keeping and using agricultural records can support better farming decisions.",
      "Crop growth is recorded over several seasons."
    ],

    correctAnswer:
      2,

    skill:
      "main-idea",

    conceptId:
      concept5.id,

    difficulty:
      "hard",

    feedback:
      "The third answer connects the records with their broader purpose and result."
  }

];


/*
|--------------------------------------------------------------------------
| FINAL STRETCH
|--------------------------------------------------------------------------
*/

const finalStretch = {
  type:
    "final_stretch",

  title:
    "🎯 FINAL STRETCH",

  message:
    "Do not chase the loudest detail. Step back and find the idea " +
    "that holds the passage together."
};


/*
|--------------------------------------------------------------------------
| COMPLETION
|--------------------------------------------------------------------------
*/

const completion = createCompletion({

  message:
    "Nice work. You can now look past individual details and find " +
    "the idea holding a passage together.",

  nextStep:
    "Next, build on this skill by learning how to find specific " +
    "information inside a passage.",

  takeaway:
    "Main idea = the central message of the whole passage, " +
    "not one isolated detail."
});


/*
|--------------------------------------------------------------------------
| COMPLETE LESSON
|--------------------------------------------------------------------------
|
| This MUST match the real createLessonContent() contract:
|
| lessonId
| title
| category
| skillId
| difficulty
| templateId
| intro
| concepts
| examConnection
| completion
|--------------------------------------------------------------------------
*/

const lesson = createLessonContent({

  lessonId:
    LESSON_ID,

  title:
    "Find the Main Idea",

  category:
    "passage",

  skillId:
    "main-idea",

  difficulty:
    "easy-to-hard",

  templateId:
    "passage-investigation",

  intro:
    introduction,

  concepts: [
    concept1,
    concept2,
    concept3,
    concept4,
    concept5
  ],

  examConnection:
    null,

  completion:
    completion
});


/*
|--------------------------------------------------------------------------
| ATTACH ORIGINAL APPLICATIONS AND FINAL STRETCH
|--------------------------------------------------------------------------
|
| These are kept outside createLessonContent because the existing
| lessonContent contract does not currently accept them.
|
| They remain available to the future lesson engine without pretending
| they are part of the current factory contract.
|--------------------------------------------------------------------------
*/

lesson.applications = applications;

lesson.finalStretch = finalStretch;


/*
|--------------------------------------------------------------------------
| SOURCE / ACADEMIC METADATA
|--------------------------------------------------------------------------
|
| This metadata helps the future content system understand where the
| academic direction came from without claiming that these examples
| are copied textbook material.
|--------------------------------------------------------------------------
*/

lesson.sourceMetadata = {

  sourceType:
    "textbook_grounded_original_instruction",

  sources: [
    "Grade 10 English Student Textbook",
    "Grade 12 English Student Textbook"
  ],

  academicSkill:
    "main-idea",

  relatedReadingSkills: [
    "gist",
    "skimming",
    "supporting-details"
  ],

  exactExamQuestionIncluded:
    false

};


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = lesson;
