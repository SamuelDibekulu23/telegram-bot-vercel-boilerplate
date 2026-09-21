const {
  createLessonContent,
  createConcept,
  createIntroduction,
  createCompletion
} = require("../lessonContent");

const LESSON_ID = "eng-passage-main-idea";

const introduction = createIntroduction({
  hook:
    "A passage can throw ten details at you and still have one main message. " +
    "Your job is not to chase every sentence. Your job is to catch the idea " +
    "holding the whole passage together.",

  goal:
    "Master the exam skill of identifying the main idea, separating it from " +
    "supporting details, and eliminating attractive but incorrect answers.",

  quickStart:
    "Think of a passage as a tree. The main idea is the trunk. " +
    "The branches, leaves and fruits are the details growing from it."
});

const concept1 = createConcept({
  id: "eng-passage-main-idea-concept-1",

  title:
    "What Is the Main Idea?",

  explanation:
    "The main idea is the central point of a passage. It tells you what " +
    "the passage is mainly about and what the writer wants you to understand " +
    "about that topic. It is usually broader than any single example, fact " +
    "or sentence.",

  noteStyle:
    "rule_card",

  note: {
    title:
      "🧠 THE MAIN-IDEA RULE",

    content:
      "Ask two questions: What is the passage about? " +
      "What important point does the writer make about it? " +
      "Put those two answers together."
  },

  analogy:
    "Imagine your friend tells you about a trip. They mention the bus, " +
    "the food, the weather, a funny moment and a beautiful view. " +
    "You would not say the trip was 'about the bus.' " +
    "Those are details. The bigger message might be that the trip " +
    "was an enjoyable experience.",

  example: {
    prompt:
      "Many students use their phones to communicate, study and find " +
      "information. Educational applications can provide lessons, " +
      "dictionaries and practice activities. When used wisely, " +
      "smartphones can therefore support learning.",

    answer:
      "Smartphones can support learning when used wisely.",

    explanation:
      "Communication, information, lessons and dictionaries are individual " +
      "details. The passage brings them together to communicate the broader " +
      "idea that smartphones can support learning when used wisely.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which answer best expresses the main idea of the smartphone passage?",

    options: [
      "Students use phones to communicate.",
      "Educational applications provide dictionaries.",
      "Smartphones can support learning when used wisely.",
      "Students use phones to find information."
    ],

    correctAnswer:
      2,

    feedback:
      "🎯 Correct. Choice C covers the whole passage. " +
      "The other choices zoom in on only one detail."
  }
});

const concept2 = createConcept({
  id: "eng-passage-main-idea-concept-2",

  title:
    "Topic Is Not the Main Idea",

  explanation:
    "The topic tells you what the passage is about. The main idea goes one " +
    "step further by telling you what the writer says about that topic. " +
    "A single word or short phrase is usually a topic, not a complete main idea.",

  noteStyle:
    "comparison_card",

  note: {
    title:
      "🔍 TOPIC vs MAIN IDEA",

    content:
      "TOPIC: exercise.\n" +
      "MAIN IDEA: Regular exercise provides several benefits for students.\n\n" +
      "The topic names the subject. The main idea gives the writer's message."
  },

  analogy:
    "If someone asks, 'What movie did you watch?' you might answer " +
    "'a football movie.' That is the topic. If they ask what the movie " +
    "was saying, you need the bigger message. That is closer to the main idea.",

  example: {
    prompt:
      "Regular exercise can benefit students in several ways. " +
      "It can improve physical fitness, help reduce stress and support " +
      "better sleep. Even a short daily walk can become part of " +
      "a healthy routine.",

    answer:
      "Regular exercise provides several benefits for students.",

    explanation:
      "Exercise is the topic. The complete main idea explains what the " +
      "writer says about exercise: it can provide several benefits.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which is the strongest main idea for the exercise passage?",

    options: [
      "Exercise.",
      "Walking.",
      "Regular exercise provides several benefits for students.",
      "Better sleep."
    ],

    correctAnswer:
      2,

    feedback:
      "🧠 Choice C gives both the subject and the writer's central message."
  }
});

const concept3 = createConcept({
  id: "eng-passage-main-idea-concept-3",

  title:
    "Main Idea vs Supporting Detail",

  explanation:
    "Supporting details explain, prove, illustrate or develop the main idea. " +
    "They can be facts, examples, reasons, results or specific information. " +
    "A detail may sound important because it is interesting or clearly stated, " +
    "but that does not automatically make it the main idea.",

  noteStyle:
    "trap_card",

  note: {
    title:
      "⚠️ THE EXAM TRAP",

    content:
      "A choice appearing word-for-word in the passage can still be wrong. " +
      "Exams often place a real supporting detail among the answer choices " +
      "to tempt you."
  },

  analogy:
    "Think of a football team. The main idea is the game plan. " +
    "A pass, shot or tackle matters, but one move is not the whole plan.",

  example: {
    prompt:
      "A school library gives students access to textbooks, storybooks and " +
      "reference materials. Students can also use the quiet space to review " +
      "lessons and complete assignments. As a result, the library can support " +
      "different aspects of students' learning.",

    answer:
      "A school library can support different aspects of students' learning.",

    explanation:
      "Textbooks, storybooks, reference materials and quiet study space are " +
      "supporting details. They all support the broader message about the " +
      "library's role in learning.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which statement is a supporting detail rather than the main idea?",

    options: [
      "A school library can support students' learning.",
      "Students can use the quiet space to complete assignments.",
      "Libraries can support different learning needs.",
      "A library can help students learn."
    ],

    correctAnswer:
      1,

    feedback:
      "🎯 Exactly. The quiet study space is one specific example of how " +
      "the library supports learning."
  }
});

const concept4 = createConcept({
  id: "eng-passage-main-idea-concept-4",

  title:
    "Use the Whole Passage",

  explanation:
    "The strongest main-idea answer must fit the passage as a whole. " +
    "Do not choose an answer simply because one sentence supports it. " +
    "Check whether the choice explains most of the important information.",

  noteStyle:
    "whole_passage",

  note: {
    title:
      "🔎 THE WHOLE-PASSAGE TEST",

    content:
      "Remove it: Would the passage still have its central message?\n\n" +
      "Coverage: Does the answer cover most of the passage?\n\n" +
      "Overly specific: Is it only one example, fact or result?\n\n" +
      "Too broad: Could it describe hundreds of unrelated passages?"
  },

  analogy:
    "Looking at one sentence to find the main idea is like judging an entire " +
    "football match from one goal. The goal matters, but you need the whole game.",

  example: {
    prompt:
      "A student prepares for an examination by dividing study time into " +
      "smaller sessions. She reviews difficult topics first, takes short " +
      "breaks and checks her mistakes after practice. After several weeks, " +
      "she notices that she remembers more and feels less overwhelmed.",

    answer:
      "Organized study habits can improve learning and reduce overwhelm.",

    explanation:
      "The passage gives several connected habits and then gives their combined " +
      "result. The main idea must connect those pieces rather than repeat only " +
      "one habit.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which answer best covers the whole study passage?",

    options: [
      "The student takes short breaks.",
      "The student reviews difficult topics first.",
      "Organized study habits can improve learning and reduce overwhelm.",
      "The student practices for several weeks."
    ],

    correctAnswer:
      2,

    feedback:
      "🔥 Choice C survives the whole-passage test because it connects " +
      "the different habits with their overall result."
  }
});

const concept5 = createConcept({
  id: "eng-passage-main-idea-concept-5",

  title:
    "Skim Before You Decide",

  explanation:
    "Skimming means reading quickly to understand the general direction " +
    "of a passage. It does not mean reading carelessly. For a main-idea " +
    "question, skimming helps you build an overall picture before you " +
    "start examining individual details.",

  noteStyle:
    "memory_trick",

  note: {
    title:
      "⚡ SMART SKIMMING",

    content:
      "Look at the beginning, notice ideas that keep appearing, " +
      "and check where the passage is heading.\n\n" +
      "You are building the map before choosing the destination."
  },

  analogy:
    "Imagine opening a map before travelling. You do not need to memorize " +
    "every street before knowing which direction you are going.",

  example: {
    prompt:
      "Before answering a main-idea question, quickly notice what the " +
      "passage introduces, which ideas keep appearing and what conclusion " +
      "or direction the writer develops.",

    answer:
      "Build an overall picture before focusing on individual details.",

    explanation:
      "The purpose of skimming here is not to skip understanding. " +
      "It gives you a fast overview so that individual details do not " +
      "control your answer.",

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
      "🧭 Correct. Skimming gives you the map first; detailed reading " +
      "can come after you know where the passage is going."
  }
});

const concept6 = createConcept({
  id: "eng-passage-main-idea-concept-6",

  title:
    "When the Main Idea Is Implied",

  explanation:
    "Sometimes the writer does not state the main idea in one obvious " +
    "sentence. In that situation, combine the important details and ask " +
    "what single message connects them. This is an inference skill.",

  noteStyle:
    "detective_card",

  note: {
    title:
      "🕵️ BECOME THE PASSAGE DETECTIVE",

    content:
      "Collect the important clues.\n" +
      "Find what they have in common.\n" +
      "Turn that common idea into one clear statement.\n\n" +
      "Do not invent information that the passage never supports."
  },

  analogy:
    "Imagine finding several footprints at a scene. One footprint gives " +
    "you a clue, but several footprints together reveal the direction. " +
    "An implied main idea works the same way.",

  example: {
    prompt:
      "At a school, students begin bringing reusable water bottles. " +
      "Teachers place water stations around the campus, and fewer plastic " +
      "bottles are collected from the school grounds. Students also begin " +
      "talking about other ways to reduce waste.",

    answer:
      "Simple school-wide changes can encourage students to reduce waste.",

    explanation:
      "The passage never directly says this sentence. Instead, several " +
      "details point toward the same broader message: a practical change " +
      "can influence environmentally responsible behavior.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "What is the best implied main idea of the school passage?",

    options: [
      "Students bring reusable bottles.",
      "Teachers install water stations.",
      "Simple school-wide changes can encourage students to reduce waste.",
      "Plastic bottles are collected from the school grounds."
    ],

    correctAnswer:
      2,

    feedback:
      "🕵️ Nice. The passage never says C word-for-word, but its details " +
      "work together to support that conclusion."
  }
});

const concept7 = createConcept({
  id: "eng-passage-main-idea-concept-7",

  title:
    "Too Narrow, Too Broad or Just Right?",

  explanation:
    "Exam choices often differ in scope. A narrow answer describes only " +
    "one small part. An overly broad answer may sound intelligent but go " +
    "far beyond the passage. The best answer sits at the right level: " +
    "broad enough to cover the passage and precise enough to remain faithful " +
    "to it.",

  noteStyle:
    "exam_lens",

  note: {
    title:
      "🎯 FIND THE RIGHT SCOPE",

    content:
      "TOO NARROW → one small detail.\n" +
      "TOO BROAD → could fit almost anything.\n" +
      "JUST RIGHT → captures the central message."
  },

  analogy:
    "Think of a camera. Zoom in too much and you only see someone's shoe. " +
    "Zoom out too far and you cannot see what matters. The best main idea " +
      "gives you the useful middle view.",

  example: {
    prompt:
      "A local school introduces a weekly reading period. Students choose " +
      "books at different levels, discuss what they read and keep short " +
      "reading journals. Teachers notice that students gradually become " +
      "more confident when discussing texts and expressing ideas.",

    answer:
      "A structured reading program can build students' confidence and " +
      "communication skills.",

    explanation:
      "Keeping journals and choosing books are details. Saying that reading " +
      "is good for everyone would be too broad. The strongest answer connects " +
      "the program's activities with the result described in the passage.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which answer has the strongest scope for the school reading passage?",

    options: [
      "Students keep reading journals.",
      "Students choose books at different levels.",
      "A structured reading program can build students' confidence and communication skills.",
      "Reading is important for everyone."
    ],

    correctAnswer:
      2,

    feedback:
      "🎯 Exactly. C is broad enough to cover the passage without making " +
      "a claim that goes beyond it."
  }
});

const concept8 = createConcept({
  id: "eng-passage-main-idea-concept-8",

  title:
    "The Five-Step Exam Method",

  explanation:
    "When the question asks for the main idea, use a repeatable process. " +
    "A method helps prevent panic, especially when four answer choices " +
    "all look strangely reasonable.",

  noteStyle:
    "strategy_card",

  note: {
    title:
      "📋 THE 5-STEP METHOD",

    content:
      "1. Identify the topic.\n" +
      "2. Skim for the overall direction.\n" +
      "3. Notice repeated or connected ideas.\n" +
      "4. Eliminate choices that are too narrow, too broad or unsupported.\n" +
      "5. Choose the answer that best covers the whole passage."
  },

  analogy:
    "Think of it like airport security. You do not randomly point at one " +
    "bag and say, 'That one looks suspicious.' You follow a process. " +
    "Main-idea questions deserve the same discipline.",

  example: {
    prompt:
      "A passage explains that students who review lessons regularly " +
      "usually have more opportunities to identify gaps in their knowledge. " +
      "It describes reviewing notes, testing memory and correcting mistakes " +
      "as useful parts of regular revision.",

    answer:
      "Regular revision can help students identify and correct gaps in learning.",

    explanation:
      "The passage gives several revision activities. The answer should " +
      "connect those activities with their central purpose rather than " +
      "selecting only one activity.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "After identifying the topic, what should you do next in the five-step method?",

    options: [
      "Choose the longest answer.",
      "Skim for the passage's overall direction.",
      "Ignore the supporting details.",
      "Pick the first option."
    ],

    correctAnswer:
      1,

    feedback:
      "🧠 Correct. First get the map of the passage, then judge the answer choices."
  }
});

const concept9 = createConcept({
  id: "eng-passage-main-idea-concept-9",

  title:
    "Watch the Distractors",

  explanation:
    "A distractor is an answer choice designed to pull you away from " +
    "the correct answer. In main-idea questions, distractors commonly use " +
    "a real detail, exaggerate the passage, mention a related idea or " +
    "sound attractive without being supported.",

  noteStyle:
    "trap_card",

  note: {
    title:
      "🚨 FOUR COMMON DISTRACTORS",

    content:
      "DETAIL TRAP → true, but too small.\n" +
      "EXTREME TRAP → stronger than the passage.\n" +
      "RELATED TRAP → connected, but not central.\n" +
      "INVENTED TRAP → sounds reasonable, but the passage does not support it."
  },

  analogy:
    "The exam is not necessarily asking, 'Which answer sounds nice?' " +
    "It is asking, 'Which answer survives the evidence?' " +
    "A confident-looking distractor can still be the wrong passenger.",

  example: {
    prompt:
      "A community opens a public study center with free desks, reference " +
      "materials and evening study hours. Students who previously lacked a " +
      "quiet place to study now have access to one. The center also hosts " +
      "occasional study-skills workshops.",

    answer:
      "A public study center can improve access to useful learning resources.",

    explanation:
      "The desks, materials, evening hours and workshops are supporting " +
      "details. The strongest answer connects them to the broader purpose " +
      "and benefit of the center.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Which choice is most clearly a detail trap?",

    options: [
      "A public study center can improve access to learning resources.",
      "The center provides free desks.",
      "The center can help students who lack a quiet study space.",
      "Community learning resources can support students."
    ],

    correctAnswer:
      1,

    feedback:
      "⚠️ Exactly. Free desks are real, but they represent only one part " +
      "of what the passage communicates."
  }
});

const concept10 = createConcept({
  id: "eng-passage-main-idea-concept-10",

  title:
    "Do Not Let One Difficult Word Defeat the Passage",

  explanation:
    "A passage may contain vocabulary you do not know. That does not mean " +
    "you cannot find its main idea. Use the surrounding sentences and the " +
    "overall direction of the passage. For a main-idea question, understanding " +
    "every single word is often less important than understanding the relationship " +
    "between the ideas.",

  noteStyle:
    "rescue_card",

  note: {
    title:
      "🛟 WHEN A WORD LOOKS SCARY",

    content:
      "Do not freeze.\n" +
      "Read around it.\n" +
      "Use context.\n" +
      "Ask whether the unknown word changes the passage's overall message.\n\n" +
      "One unfamiliar word does not get to steal the whole question."
  },

  analogy:
    "If someone tells you a story and you miss one word because a bus passes " +
    "by, you can still understand the story from everything around it.",

  example: {
    prompt:
      "The school introduced several measures to mitigate unnecessary waste. " +
      "Students reused paper, teachers reduced disposable materials and the " +
      "cafeteria introduced reusable containers. Within a few months, the " +
      "amount of waste produced by the school decreased.",

    answer:
      "The school used practical measures to reduce unnecessary waste.",

    explanation:
      "Even if you do not know the word 'mitigate', the surrounding details " +
      "show what the school was trying to do. The examples reveal the broader " +
      "message.",

    realWorld:
      true
  },

  microCheck: {
    question:
      "Based on context, what does 'mitigate' most nearly mean in the passage?",

    options: [
      "Increase",
      "Reduce or lessen",
      "Ignore",
      "Measure exactly"
    ],

    correctAnswer:
      1,

    feedback:
      "💡 The examples—reusing paper, reducing disposable materials and using " +
      "reusable containers—show that the school was trying to lessen waste."
  }
});

const applications = [
  {
    id: "eng-passage-main-idea-application-1",

    type: "exam_style",

    difficulty: "easy",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "Many students find it difficult to concentrate when they study " +
      "with constant notifications. Turning off unnecessary notifications " +
      "can reduce interruptions. Keeping the phone away from the study " +
      "area can also help students remain focused.",

    options: [
      "Students receive many phone notifications.",
      "Turning off notifications is the only way to study.",
      "Simple changes to phone use can help students concentrate.",
      "Students should never use phones while studying."
    ],

    correctAnswer: 2,

    explanation:
      "The passage gives two examples: reducing notifications and keeping " +
      "the phone away. Both support the broader idea that simple changes " +
      "to phone use can improve concentration.",

    trap:
      "Choice A is true but too narrow. Choice D goes beyond the passage " +
      "by saying students should never use phones.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-2",

    type: "exam_style",

    difficulty: "medium",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "Urban gardens can provide more than vegetables. They can give " +
      "residents a place to work together, teach children about plants " +
      "and make unused spaces more attractive. In some communities, " +
      "these gardens have also encouraged people to discuss other " +
      "neighborhood improvements.",

    options: [
      "Urban gardens produce vegetables.",
      "Children can learn about plants in gardens.",
      "Urban gardens can provide several social and environmental benefits.",
      "People should turn every unused space into a garden."
    ],

    correctAnswer: 2,

    explanation:
      "The passage mentions vegetables, education, attractive spaces, " +
      "community cooperation and wider neighborhood discussion. Choice C " +
      "covers those connected ideas without going beyond the passage.",

    trap:
      "Choice A and B are supporting details. Choice D is an extreme claim " +
      "that the passage never makes.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-3",

    type: "exam_style",

    difficulty: "medium",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "Before an important examination, Hana created a weekly plan. " +
      "She gave extra time to subjects she found difficult, tested herself " +
      "without looking at her notes and reviewed mistakes from previous " +
      "practice sessions. Her preparation became more organized and she " +
      "felt more confident about the examination.",

    options: [
      "Hana studied difficult subjects.",
      "Hana tested herself without notes.",
      "Hana reviewed previous mistakes.",
      "A structured study plan can make examination preparation more effective."
    ],

    correctAnswer: 3,

    explanation:
      "The first three choices are individual actions. Choice D combines " +
      "the actions and the overall result, so it represents the passage " +
      "as a whole.",

    trap:
      "This is a classic detail trap. The passage deliberately gives several " +
      "specific actions that are tempting to select.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-4",

    type: "exam_style",

    difficulty: "tricky",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "Some students believe that making longer study sessions automatically " +
      "leads to better results. However, studying for many hours without " +
      "planning can lead to tiredness and poor concentration. Shorter sessions " +
      "with clear goals, active recall and planned breaks may make study time " +
      "more productive.",

    options: [
      "Long study sessions always produce poor results.",
      "Students should study only for short periods.",
      "Study effectiveness depends on how study time is organized, not simply on its length.",
      "Active recall is the most important study technique."
    ],

    correctAnswer: 2,

    explanation:
      "The passage compares long unplanned sessions with shorter organized " +
      "sessions. Its central message is about the organization and quality " +
      "of study time, not simply the number of hours.",

    trap:
      "Choice A is too extreme because the passage does not say long sessions " +
      "always fail. Choice D focuses on only one technique.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-5",

    type: "exam_style",

    difficulty: "tricky",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "A town once treated a small river as little more than a place for " +
      "discarding waste. After residents organized clean-up activities, " +
      "local businesses helped provide waste containers and schools began " +
      "teaching students about protecting the river. Over time, the area " +
      "became cleaner and residents started using the riverside as a public space.",

    options: [
      "Schools teach students about rivers.",
      "Local businesses provided waste containers.",
      "Community cooperation can help transform an overlooked public environment.",
      "The river became a place for public activities."
    ],

    correctAnswer: 2,

    explanation:
      "The passage describes several groups contributing to one broader " +
      "change. Choice C connects the clean-up, business support, education " +
      "and improved public space.",

    trap:
      "Each of the other choices comes directly from the passage, but each " +
      "captures only one piece of the story.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-6",

    type: "exam_style",

    difficulty: "super-tricky",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "When a school first introduced digital assignments, some teachers " +
      "focused mainly on replacing printed worksheets with electronic files. " +
      "Later, teachers began using the technology differently: students " +
      "received immediate feedback, collaborated on shared documents and " +
      "revised their work more frequently. The change suggested that the " +
      "value of educational technology depended less on replacing paper " +
      "and more on how teachers used it to improve learning.",

    options: [
      "Digital assignments can replace printed worksheets.",
      "Teachers use shared documents for collaboration.",
      "Students can revise digital assignments more frequently.",
      "The educational value of technology depends greatly on how it is used for learning."
    ],

    correctAnswer: 3,

    explanation:
      "The passage begins with simple replacement of paper but then contrasts " +
      "that with more meaningful uses of technology. Choice D captures the " +
      "development and conclusion of the entire passage.",

    trap:
      "Choices A, B and C are all supported by the passage, which is exactly " +
      "why they are dangerous distractors. They are true, but they do not " +
      "express the central message.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-7",

    type: "exam_style",

    difficulty: "super-tricky",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "A school wanted students to read more, so it first increased the " +
      "number of books in its library. The number of books alone did not " +
      "change students' reading habits very much. The school then allowed " +
      "students to recommend books, created quiet reading periods and " +
      "organized small discussions. Participation increased, suggesting " +
      "that access to books was only one part of creating a stronger " +
      "reading culture.",

    options: [
      "The school bought more books.",
      "Students recommended books to the school.",
      "Libraries need many books.",
      "Creating a reading culture may require both resources and opportunities for active participation."
    ],

    correctAnswer: 3,

    explanation:
      "The passage begins with resources but shows that resources alone were " +
      "not enough. The later activities explain what changed participation. " +
      "Choice D captures that contrast and conclusion.",

    trap:
      "Choice C sounds like a reasonable general statement, but the passage " +
      "actually challenges the idea that having many books alone is sufficient.",

    label:
      "Original FineBot practice"
  },

  {
    id: "eng-passage-main-idea-application-8",

    type: "exam_style",

    difficulty: "super-tricky",

    question:
      "Read the passage and choose the best main idea.\n\n" +
      "A farmer notices that one part of a field produces less than another. " +
      "Instead of applying the same amount of fertilizer everywhere, he checks " +
      "the soil in different areas. He discovers that some sections have " +
      "different nutrient needs and adjusts his treatment accordingly. " +
      "The following season, the field produces more evenly.",

    options: [
      "Farmers should always use more fertilizer.",
      "Different parts of a field may have different nutrient needs.",
      "Checking soil conditions can help farmers make more precise decisions.",
      "The farmer produced more crops in the following season."
    ],

    correctAnswer: 2,

    explanation:
      "The passage is not simply saying that different areas have different " +
      "nutrients. It develops the idea that checking conditions allows a farmer " +
      "to adjust decisions more precisely and improve the result.",

    trap:
      "Choice B is true, but it stops at an observation. Choice C captures " +
      "the action, reasoning and result together.",

    label:
      "Original FineBot practice"
  }
];

const finalStretch = {
  id:
    "eng-passage-main-idea-final-stretch",

  title:
    "FINAL STRETCH — Can You Beat the Distractors?",

  instruction:
    "These questions are designed to feel more like the moment in an " +
    "examination when several choices seem possible. Slow down, use the " +
    "whole-passage test and eliminate choices with evidence.",

  questions: [
    {
      id:
        "eng-passage-main-idea-final-1",

      difficulty:
        "tricky",

      question:
        "A university library extends its opening hours during examination " +
        "periods. It also adds more quiet study spaces and provides online " +
        "access to several reference resources. Students report that these " +
        "changes make it easier to find suitable places and materials for study.\n\n" +
        "What is the best main idea?",

      options: [
        "The library opens longer during examinations.",
        "Students use quiet study spaces.",
        "Libraries can improve students' study opportunities by providing suitable access, spaces and resources.",
        "Students need online reference resources."
      ],

      correctAnswer:
        2,

      explanation:
        "The passage combines opening hours, physical spaces and online " +
        "resources. Choice C covers all three and connects them to their " +
        "shared purpose.",

      trap:
        "Choices A, B and D are real details, but none covers the entire passage.",

      label:
        "Original FineBot final stretch"
    },

    {
      id:
        "eng-passage-main-idea-final-2",

      difficulty:
        "super-tricky",

      question:
        "A community once depended heavily on one source of income. When " +
        "demand for that product decreased, many families experienced " +
        "financial difficulty. The community later supported small businesses, " +
        "vocational training and new agricultural activities. These changes " +
        "gave residents more ways to earn income.\n\n" +
        "What is the best main idea?",

      options: [
        "Demand for one product decreased.",
        "Vocational training can help residents.",
        "Agriculture is important to communities.",
        "Diversifying economic activities can make communities less dependent on a single source of income."
      ],

      correctAnswer:
        3,

      explanation:
        "The passage begins with dependence on one source and then describes " +
        "several alternatives. The final answer connects the problem, the " +
        "response and the result.",

      trap:
        "The first three choices isolate individual parts of the passage. " +
        "The fourth explains why those parts were introduced together.",

      label:
        "Original FineBot final stretch"
    },

    {
      id:
        "eng-passage-main-idea-final-3",

      difficulty:
        "super-tricky",

      question:
        "Some people think that correcting every mistake immediately is always " +
        "the best way to learn. However, researchers and teachers often encourage " +
        "learners to attempt a problem, examine the error and then understand " +
        "why the correct answer works. This process can help learners notice " +
        "patterns in their mistakes rather than simply replacing one answer " +
        "with another.\n\n" +
        "What is the best main idea?",

      options: [
        "Learners make mistakes.",
        "Correct answers are important.",
        "Understanding the reason behind mistakes can make learning more meaningful.",
        "Teachers should never correct students immediately."
      ],

      correctAnswer:
        2,

      explanation:
        "The passage contrasts immediate correction with understanding the " +
        "reason behind an error. Choice C captures the central learning principle.",

      trap:
        "Choice D is too absolute. The passage does not say immediate correction " +
        "should never happen; it explains why understanding mistakes matters.",

      label:
        "Original FineBot final stretch"
    }
  ]
};

const completion = createCompletion({
  title:
    "Main Idea Mastered",

  message:
    "You now have a method for finding the writer's central message " +
    "without getting trapped by attractive details.",

  nextStep:
    "Keep this method ready whenever a passage asks for the main idea, " +
    "especially when several choices look correct.",

  reward:
    {
      xp:
        10,

      achievement:
        "Main Idea Starter"
    }
  }
});

const lesson = createLessonContent({
  lessonId: LESSON_ID,

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
    concept5,
    concept6,
    concept7,
    concept8,
    concept9,
    concept10
  ],

  examConnection:
    null,

  completion:
    completion
});

lesson.applications =
  applications;

lesson.finalStretch =
  finalStretch;

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
    "supporting-details",
    "inference",
    "contextual-reading"
  ],

  examFocus: [
    "main idea",
    "supporting details",
    "inference",
    "distractor elimination",
    "whole-passage reasoning"
  ],

  difficultyProgression: [
    "easy",
    "medium",
    "tricky",
    "super-tricky"
  ],

  exactExamQuestionIncluded:
    false
};

module.exports = lesson;