/**
 * FineBot English Rewards Engine
 *
 * Purpose:
 * Defines what genuine learning progress earns.
 *
 * This module does NOT:
 * - save XP to the database
 * - modify student records
 * - decide achievements
 * - control Telegram messages
 *
 * It only calculates and describes legitimate rewards.
 */

const REWARD_TYPES = {
  CONCEPT: "concept",
  LESSON: "lesson",
  STREAK: "streak",
  ACHIEVEMENT: "achievement"
};

const REWARDS = {
  CONCEPT_XP: 10,
  LESSON_XP: 10
};


/**
 * Create a concept-completion reward.
 *
 * A student earns this when an actual concept
 * has been completed.
 */
function createConceptReward() {
  return {
    type: REWARD_TYPES.CONCEPT,
    xp: REWARDS.CONCEPT_XP,
    emoji: "⭐",
    title: "Concept complete!",
    message: `+${REWARDS.CONCEPT_XP} XP`
  };
}


/**
 * Create a lesson-completion reward.
 *
 * This is separate from concept XP.
 */
function createLessonReward() {
  return {
    type: REWARD_TYPES.LESSON,
    xp: REWARDS.LESSON_XP,
    emoji: "🎉",
    title: "Lesson complete!",
    message: `+${REWARDS.LESSON_XP} XP`
  };
}


/**
 * Create a streak recognition reward.
 *
 * Streak XP is intentionally not added here yet.
 * The existing global progress system owns streak
 * calculation. This module only describes recognition.
 */
function createStreakReward(streak) {
  if (!Number.isInteger(streak) || streak <= 0) {
    return null;
  }

  return {
    type: REWARD_TYPES.STREAK,
    xp: 0,
    emoji: "🔥",
    title: `${streak} day streak!`,
    message: `You've shown up ${streak} day${
      streak === 1 ? "" : "s"
    } in a row.`
  };
}


/**
 * Create an achievement reward.
 *
 * Achievement unlocking itself is handled by the
 * existing achievement system.
 */
function createAchievementReward(achievement) {
  if (!achievement || typeof achievement !== "object") {
    return null;
  }

  return {
    type: REWARD_TYPES.ACHIEVEMENT,
    xp: Number.isFinite(achievement.xp)
      ? achievement.xp
      : 0,
    emoji: achievement.emoji || "🏆",
    title: achievement.title || "Achievement unlocked!",
    message:
      achievement.message ||
      achievement.title ||
      "You unlocked a new achievement."
  };
}


/**
 * Calculate the XP earned for completing a concept.
 */
function getConceptXP() {
  return REWARDS.CONCEPT_XP;
}


/**
 * Calculate the XP earned for completing a lesson.
 */
function getLessonXP() {
  return REWARDS.LESSON_XP;
}


/**
 * Create a combined reward summary.
 *
 * Useful when a lesson completion produces both
 * concept XP and lesson-completion XP.
 */
function createLessonRewardSummary({
  conceptsCompleted = 0,
  lessonCompleted = false,
  streak = null,
  achievement = null
} = {}) {
  const rewards = [];

  if (
    Number.isInteger(conceptsCompleted) &&
    conceptsCompleted > 0
  ) {
    for (let i = 0; i < conceptsCompleted; i++) {
      rewards.push(createConceptReward());
    }
  }

  if (lessonCompleted) {
    rewards.push(createLessonReward());
  }

  if (streak !== null) {
    const streakReward = createStreakReward(streak);

    if (streakReward) {
      rewards.push(streakReward);
    }
  }

  if (achievement) {
    const achievementReward =
      createAchievementReward(achievement);

    if (achievementReward) {
      rewards.push(achievementReward);
    }
  }

  return rewards;
}


/**
 * Calculate total XP contained in a reward list.
 */
function getTotalRewardXP(rewards = []) {
  if (!Array.isArray(rewards)) {
    return 0;
  }

  return rewards.reduce((total, reward) => {
    if (!reward || !Number.isFinite(reward.xp)) {
      return total;
    }

    return total + reward.xp;
  }, 0);
}


/**
 * Format a single reward for the user interface.
 *
 * The UI layer will decide where/how this is displayed.
 */
function formatReward(reward) {
  if (!reward) {
    return "";
  }

  if (reward.type === REWARD_TYPES.CONCEPT) {
    return `⭐ +${reward.xp} XP — Concept complete!`;
  }

  if (reward.type === REWARD_TYPES.LESSON) {
    return `🎉 +${reward.xp} XP — Lesson complete!`;
  }

  if (reward.type === REWARD_TYPES.STREAK) {
    return `🔥 ${reward.title}\n${reward.message}`;
  }

  if (reward.type === REWARD_TYPES.ACHIEVEMENT) {
    return `${reward.emoji} ${reward.title}\n${reward.message}`;
  }

  return reward.message || "";
}


/**
 * Format several rewards together.
 */
function formatRewards(rewards = []) {
  if (!Array.isArray(rewards) || rewards.length === 0) {
    return "";
  }

  return rewards
    .map(formatReward)
    .filter(Boolean)
    .join("\n");
}


module.exports = {
  REWARD_TYPES,
  REWARDS,

  createConceptReward,
  createLessonReward,
  createStreakReward,
  createAchievementReward,

  getConceptXP,
  getLessonXP,

  createLessonRewardSummary,
  getTotalRewardXP,

  formatReward,
  formatRewards
};
