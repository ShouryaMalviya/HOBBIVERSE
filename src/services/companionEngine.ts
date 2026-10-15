import { CategorySlug } from "@/types";

export interface CompanionMessage {
  id: string;
  sender: "companion" | "user";
  text: string;
  timestamp: string;
  suggestedHobbySlug?: string;
  suggestedHobbyTitle?: string;
  suggestedMicroStep?: string;
  category?: CategorySlug;
}

export const INITIAL_COMPANION_MESSAGES: CompanionMessage[] = [
  {
    id: "msg-init-1",
    sender: "companion",
    text: "Welcome to the atelier. I'm your creative companion—here to help you find gentle beginnings, break hobbies into bite-sized 5-minute steps, and adapt practices to your time and energy.\n\nWhether you have 10 quiet minutes before sleep or a free Sunday morning, tell me what you're feeling curious about today.",
    timestamp: "Just now",
    suggestedHobbySlug: "botanical-watercolor",
    suggestedHobbyTitle: "Botanical Watercolor Painting",
    suggestedMicroStep: "Dip a single brush into water and lay a clear water droplet on cotton paper.",
    category: "art-craft",
  },
];

export function generateCompanionReply(
  userText: string,
  context?: { savedHobbySlugs?: string[] }
): Omit<CompanionMessage, "id" | "timestamp"> {
  const q = userText.toLowerCase().trim();

  // 1. Guilt, missed days, restart, overwhelmed
  if (
    q.includes("miss") ||
    q.includes("guilt") ||
    q.includes("fell off") ||
    q.includes("restart") ||
    q.includes("overwhelm") ||
    q.includes("behind") ||
    q.includes("streak")
  ) {
    return {
      sender: "companion",
      text: "First, take a full, easy breath. In Hobbiverse, there is no such thing as 'falling behind.' Creative hobbies are not a chore list or an athletic streak—they are an open door that waits patiently for you.\n\nWhen energy returns, do not try to make up for lost time. Start with the smallest possible gesture: touch your supplies, brew a single cup of tea, or write one sentence. The gentle rhythm resets instantly without penalty.",
      suggestedHobbySlug: "gongfu-tea-ritual",
      suggestedHobbyTitle: "Mindful Gongfu Tea Ritual",
      suggestedMicroStep: "Warm a ceramic cup with hot water and breathe in the rising steam for 60 seconds.",
      category: "mindful",
    };
  }

  // 2. Low energy, tired, evening, calm, wind-down
  if (
    q.includes("tired") ||
    q.includes("low energy") ||
    q.includes("exhausted") ||
    q.includes("evening") ||
    q.includes("wind down") ||
    q.includes("sleep") ||
    q.includes("calm") ||
    q.includes("relax")
  ) {
    return {
      sender: "companion",
      text: "On low-energy evenings, the best hobby is one with zero setup friction and no performance pressure. Floor mobility and tea rituals require almost no cleanup and gently transition your nervous system away from screen alertness.",
      suggestedHobbySlug: "restorative-mobility",
      suggestedHobbyTitle: "Gentle Restorative Mobility",
      suggestedMicroStep: "Lie on your back on a living room rug with arms open like a cactus for 5 deep belly breaths.",
      category: "movement",
    };
  }

  // 3. Hands-on, tactile, watercolor, painting, art
  if (
    q.includes("art") ||
    q.includes("paint") ||
    q.includes("watercolor") ||
    q.includes("draw") ||
    q.includes("sketch") ||
    q.includes("tactile") ||
    q.includes("hands")
  ) {
    return {
      sender: "companion",
      text: "Working with pigments on paper is wonderfully meditative because water moves with its own organic logic. You don't need a finished botanical illustration—just watching a drop of sap green bleed into wet paper will delight your senses.",
      suggestedHobbySlug: "botanical-watercolor",
      suggestedHobbyTitle: "Botanical Watercolor Painting",
      suggestedMicroStep: "Paint three single leaves on scrap paper using varying brush pressure—light at the tip, firm in the center.",
      category: "art-craft",
    };
  }

  // 4. Sourdough, baking, bread, cooking, kitchen
  if (
    q.includes("bake") ||
    q.includes("bread") ||
    q.includes("sourdough") ||
    q.includes("cook") ||
    q.includes("kitchen") ||
    q.includes("ferment")
  ) {
    return {
      sender: "companion",
      text: "Baking with wild yeast connects you to an ancient kitchen rhythm. The secret is that 95% of sourdough is ambient waiting—active hands-on time is only about 15 minutes of gentle stretch-and-folds. If you don't own a dutch oven yet, a deep oven-safe pot with foil works nicely.",
      suggestedHobbySlug: "sourdough-baking",
      suggestedHobbyTitle: "Artisan Sourdough Rhythm",
      suggestedMicroStep: "Mix equal spoonfuls of flour and water in a small glass jar and place a rubber band around the level.",
      category: "cooking",
    };
  }

  // 5. Music, acoustic, guitar, song, sound
  if (
    q.includes("music") ||
    q.includes("guitar") ||
    q.includes("instrument") ||
    q.includes("acoustic") ||
    q.includes("song") ||
    q.includes("fingerstyle")
  ) {
    return {
      sender: "companion",
      text: "Acoustic fingerstyle guitar is like having a quiet conversation with wood and strings. Rather than fast strumming, practicing a slow alternating thumb bass on the lowest two strings creates a grounding, hypnotic pulse that sounds musical right away.",
      suggestedHobbySlug: "fingerstyle-guitar",
      suggestedHobbyTitle: "Fingerstyle Acoustic Guitar",
      suggestedMicroStep: "Rest your right thumb on string 5 and pluck steady quarter notes to a slow relaxed breath.",
      category: "music",
    };
  }

  // 6. Outdoors, nature, plants, flowers, foraging
  if (
    q.includes("nature") ||
    q.includes("outdoor") ||
    q.includes("plant") ||
    q.includes("flower") ||
    q.includes("forag") ||
    q.includes("walk")
  ) {
    return {
      sender: "companion",
      text: "Botanical pressing transforms an ordinary neighborhood walk into a treasure hunt for textures. You don't need expensive wood presses—two heavy hardback books with clean printer paper will preserve clover, ferns, and cherry leaves perfectly.",
      suggestedHobbySlug: "pressed-herbarium",
      suggestedHobbyTitle: "Pressed Flower Herbarium",
      suggestedMicroStep: "Collect three dry fallen leaves on your next stroll and sandwich them between clean newsprint under a heavy book.",
      category: "outdoors-nature",
    };
  }

  // 7. Screen-free, digital detox, offline, screen time
  if (
    q.includes("screen") ||
    q.includes("digital") ||
    q.includes("offline") ||
    q.includes("detox") ||
    q.includes("eyes")
  ) {
    return {
      sender: "companion",
      text: "To rest your eyes from backlit glass, sensory grounding is key: the aroma of warm clay, the tactile drag of a nib across cotton paper, or the resonant vibration of acoustic wood against your chest.",
      suggestedHobbySlug: "gongfu-tea-ritual",
      suggestedHobbyTitle: "Mindful Gongfu Tea Ritual",
      suggestedMicroStep: "Place dry whole leaves in a warmed teapot, close your eyes, and inhale the roasted aroma for three breaths.",
      category: "mindful",
    };
  }

  // 8. Writing, stories, fiction, journal
  if (
    q.includes("write") ||
    q.includes("story") ||
    q.includes("fiction") ||
    q.includes("words") ||
    q.includes("journal")
  ) {
    return {
      sender: "companion",
      text: "Micro-fiction is liberating because you don't need to outline a whole novel. In 100 words, you capture a single resonant moment: the weight of an old brass key, the sound of rain on train windows, or a whispered recipe note.",
      suggestedHobbySlug: "flash-fiction",
      suggestedHobbyTitle: "Micro-Fiction & Observation Journaling",
      suggestedMicroStep: "Pick an object on your desk right now and write three sentences describing an unusual memory tied to it.",
      category: "reading-writing",
    };
  }

  // 9. Board games, puzzles, cooperative, social
  if (
    q.includes("game") ||
    q.includes("board game") ||
    q.includes("puzzle") ||
    q.includes("play") ||
    q.includes("social")
  ) {
    return {
      sender: "companion",
      text: "Modern cooperative tabletop games are brilliant for both solo unwinding and quiet evenings with friends. You work together against the game system itself, completely removing cutthroat competition or hurt feelings.",
      suggestedHobbySlug: "cooperative-tabletop",
      suggestedHobbyTitle: "Modern Cooperative Board Games",
      suggestedMicroStep: "Read through a quick four-page rule summary and walk through one solo puzzle round.",
      category: "social-games",
    };
  }

  // 10. Budget, low cost, free, cheap supplies
  if (
    q.includes("budget") ||
    q.includes("cost") ||
    q.includes("cheap") ||
    q.includes("free") ||
    q.includes("expensive") ||
    q.includes("money")
  ) {
    return {
      sender: "companion",
      text: "The best beginner hobbies cost under $10 or use items you already have in your kitchen or drawer. Micro-fiction requires only paper and ink; leaf pressing needs only fallen garden leaves and heavy books; somatic mobility is completely free.",
      suggestedHobbySlug: "pressed-herbarium",
      suggestedHobbyTitle: "Pressed Flower Herbarium",
      suggestedMicroStep: "Find a heavy book in your bookcase and test-press a garden petal inside blotting paper.",
      category: "outdoors-nature",
    };
  }

  // 11. General / Default thoughtful guidance
  return {
    sender: "companion",
    text: "That sounds like a wonderful creative inclination. The atelier philosophy is to start smaller than you think you need to. Choose an activity you can begin within two minutes of sitting down, without complicated setup.\n\nTake a look at this gentle pathway below—would this match your pace today?",
    suggestedHobbySlug: "botanical-watercolor",
    suggestedHobbyTitle: "Botanical Watercolor Painting",
    suggestedMicroStep: "Lay out one brush, a small jar of water, and paper. Sit quietly for 60 seconds before putting brush to paper.",
    category: "art-craft",
  };
}
