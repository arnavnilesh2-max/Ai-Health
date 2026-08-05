import { UserProfile, Exercise, Recipe, DailyQuest, SocialPost, ProgressLog } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Alex Vance",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  age: 26,
  gender: "male",
  heightCm: 178,
  weightKg: 74,
  targetWeightKg: 78,
  bodyStructure: "Mesomorph",
  goal: "muscle_gain",
  activityLevel: "moderate",
  xp: 1450,
  level: 5,
  coins: 380,
  streakDays: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: [
    { id: '1', name: 'First Blood', description: 'Completed your first AI workout session', icon: '🔥', unlockedAt: '2026-07-28', category: 'workout' },
    { id: '2', name: 'Macro Ninja', description: 'Hit your daily protein target 3 days in a row', icon: '🥑', unlockedAt: '2026-08-02', category: 'nutrition' },
    { id: '3', name: 'Streak King', description: 'Maintained a 5-day active workout streak', icon: '⚡', unlockedAt: '2026-08-04', category: 'streak' },
  ]
};

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Dynamic Calisthenics & Push Burst',
    category: 'Calisthenics',
    targetBodyPart: 'Chest, Shoulders & Triceps',
    suitableBodyStructures: ['Mesomorph', 'Ectomorph', 'Athletic Build'],
    durationMinutes: 15,
    sets: 4,
    reps: '12 - 15 reps',
    caloriesBurned: 160,
    xpReward: 120,
    coinsReward: 35,
    difficulty: 'Intermediate',
    description: 'A explosive upper-body calisthenics routine that builds dense chest muscle and core stability without heavy equipment.',
    steps: [
      'Warm up with 2 minutes of arm circles and torso twists.',
      'Set 1: Incline push-ups x 15 reps with slow 3-second descent.',
      'Set 2: Standard diamond or wide push-ups x 12 reps.',
      'Set 3: Decline push-ups (feet on chair/bench) x 12 reps.',
      'Set 4: Plank hold for 45 seconds to finish.'
    ],
    tips: [
      'Keep core engaged and body straight like an iron rod.',
      'Exhale power on pushing up, inhale on descent.'
    ]
  },
  {
    id: 'ex-2',
    title: 'Metabolic Fat-Torch HIIT Blast',
    category: 'HIIT',
    targetBodyPart: 'Full Body & Core',
    suitableBodyStructures: ['Endomorph', 'Heavy Build', 'Mesomorph'],
    durationMinutes: 20,
    sets: 5,
    reps: '45s work / 15s rest',
    caloriesBurned: 240,
    xpReward: 180,
    coinsReward: 50,
    difficulty: 'Intermediate',
    description: 'Optimized high-intensity intervals designed to maximize post-exercise oxygen consumption (EPOC) for accelerated fat loss.',
    steps: [
      'Station 1: High Knees with active arm pumps (45s). Rest 15s.',
      'Station 2: Bodyweight Squats to Jump Squat (45s). Rest 15s.',
      'Station 3: Mountain Climbers with rapid tempo (45s). Rest 15s.',
      'Station 4: Shadow Boxing with duck & weave (45s). Rest 15s.',
      'Station 5: Jumping Jacks & Burpee combo (45s). Rest 15s. Repeat 2 rounds!'
    ],
    tips: [
      'Push hard during the 45s work period to keep heart rate elevated.',
      'Drink water in micro-sips during rest.'
    ]
  },
  {
    id: 'ex-3',
    title: 'Hypertrophy Dumbbell Compound Sculpt',
    category: 'Strength',
    targetBodyPart: 'Quads, Glutes & Upper Back',
    suitableBodyStructures: ['Ectomorph', 'Mesomorph', 'Athletic Build'],
    durationMinutes: 25,
    sets: 4,
    reps: '10 - 12 reps',
    caloriesBurned: 210,
    xpReward: 200,
    coinsReward: 60,
    difficulty: 'Intermediate',
    description: 'Heavy compound movements engineered to stimulate maximum muscle fiber recruitment and HGH growth response.',
    steps: [
      'Goblet Squat with heavy dumbbell x 12 reps.',
      'Dumbbell Romanian Deadlifts targeting hamstrings x 12 reps.',
      'Bent-over Two-Arm Dumbbell Rows x 10 reps.',
      'Overhead Dumbbell Shoulder Press x 10 reps.'
    ],
    tips: [
      'Maintain neutral spine on deadlifts; do not round back.',
      'Pause for 1 second at maximum muscle contraction.'
    ]
  },
  {
    id: 'ex-4',
    title: 'Low-Impact Core & Spine Mobility Flow',
    category: 'Flexibility',
    targetBodyPart: 'Abs, Lower Back & Hips',
    suitableBodyStructures: ['Endomorph', 'Heavy Build', 'Ectomorph'],
    durationMinutes: 12,
    sets: 3,
    reps: '10 smooth reps each',
    caloriesBurned: 85,
    xpReward: 90,
    coinsReward: 25,
    difficulty: 'Beginner',
    description: 'Joint-safe core strengthening and hip decompression tailored for joint protection and active recovery days.',
    steps: [
      'Cat-Cow Stretch for 60 seconds.',
      'Bird-Dog extensions holding 3s per side x 10 reps.',
      'Deadbug movement with controlled breathing x 12 reps.',
      'Glute Bridge hold with squeezing glutes at top for 30s.'
    ],
    tips: [
      'Focus on deep diaphragm breathing in through nose, out through mouth.',
      'Zero joint strain; gentle tension only.'
    ]
  },
  {
    id: 'ex-5',
    title: 'Sprint Interval & Agility Drills',
    category: 'Cardio',
    targetBodyPart: 'Legs, Heart & Endurance',
    suitableBodyStructures: ['Athletic Build', 'Mesomorph', 'Ectomorph'],
    durationMinutes: 18,
    sets: 6,
    reps: '30s sprint / 60s walk',
    caloriesBurned: 220,
    xpReward: 160,
    coinsReward: 45,
    difficulty: 'Advanced',
    description: 'Rapid speed sprints that trigger fast-twitch motor units and build lean athletic speed.',
    steps: [
      'Warmup brisk walk / light jog (3 mins).',
      'Sprint 100% effort for 30 seconds.',
      'Walk recovery for 60 seconds.',
      'Repeat sprint cycles 6 times.',
      'Cool down with 3 mins light walk and hamstring stretches.'
    ],
    tips: [
      'Land on mid-foot to absorb impact smoothly.',
      'Drive arms back forcefully to maintain sprint cadence.'
    ]
  }
];

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: '15-Minute Chipotle Garlic Chicken Power Bowl',
    category: 'High Protein',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    calories: 520,
    proteinGrams: 48,
    carbsGrams: 45,
    fatGrams: 14,
    efficiencyRating: 9.8,
    difficulty: 'Easy',
    tags: ['High Protein', 'Fast Prep', 'Muscle Building'],
    ingredients: [
      '200g Chicken breast (cubed)',
      '1 cup Pre-cooked Brown Rice or Quinoa',
      '1/2 avocado (sliced)',
      '1/2 cup Black beans (rinsed)',
      '1 tbsp Chipotle olive oil & garlic powder',
      'Fresh lime juice & cilantro'
    ],
    instructions: [
      'Heat skillet on high heat with 1 tbsp Chipotle olive oil.',
      'Add cubed chicken breast, sprinkle garlic powder, salt, and smoked paprika. Sear for 6-8 mins until golden brown.',
      'Microwave pre-cooked brown rice/quinoa for 90 seconds.',
      'Assemble bowl: Rice layer, topped with chicken, black beans, sliced avocado.',
      'Squeeze fresh lime juice and top with salsa or cilantro. Enjoy immediate 48g protein boost!'
    ]
  },
  {
    id: 'rec-2',
    title: 'Velvety Chocolate-Banana Pro Oats',
    category: 'Quick & Easy',
    prepTimeMinutes: 3,
    cookTimeMinutes: 4,
    calories: 410,
    proteinGrams: 35,
    carbsGrams: 52,
    fatGrams: 7,
    efficiencyRating: 9.9,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Pre-Workout Energy', 'Budget Friendly'],
    ingredients: [
      '1/2 cup Rolled oats',
      '1 scoop Whey/Plant Chocolate Protein Powder',
      '1 Ripe banana (sliced)',
      '1 cup Unsweetened almond milk',
      '1 tbsp Chia seeds or PB Fit peanut powder'
    ],
    instructions: [
      'Combine oats, chia seeds, and almond milk in a microwaveable bowl.',
      'Microwave for 90 seconds. Stir well.',
      'Let cool for 1 minute, then fold in 1 scoop Chocolate protein powder and 1 tbsp PB Fit.',
      'Top with sliced banana and a dash of cinnamon. Delicious warm fuel ready in 5 mins!'
    ]
  },
  {
    id: 'rec-3',
    title: 'Seared Salmon & Asparagus Keto Bowl',
    category: 'Low Carb',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    calories: 460,
    proteinGrams: 42,
    carbsGrams: 8,
    fatGrams: 26,
    efficiencyRating: 9.4,
    difficulty: 'Easy',
    tags: ['Low Carb', 'Healthy Fats', 'Omega 3'],
    ingredients: [
      '180g Wild salmon fillet',
      '1 bunch Fresh asparagus spears',
      '1 tbsp Grass-fed butter or olive oil',
      '1 clove Lemon garlic butter glaze',
      'Sea salt & cracked black pepper'
    ],
    instructions: [
      'Melt butter in non-stick pan over medium-high heat.',
      'Place salmon skin-side down with asparagus on the side.',
      'Sear salmon skin until crispy (4 mins), flip once for 3 mins.',
      'Toss asparagus in pan drippings with lemon zest.',
      'Serve warm. Packed with healthy Omega-3 fats for brain & joint health.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Speedy Beef & Broccoli Sesame Stir-Fry',
    category: 'Meal Prep',
    prepTimeMinutes: 7,
    cookTimeMinutes: 8,
    calories: 540,
    proteinGrams: 45,
    carbsGrams: 38,
    fatGrams: 18,
    efficiencyRating: 9.6,
    difficulty: 'Medium',
    tags: ['High Protein', 'Post-Workout', 'Savory'],
    ingredients: [
      '180g Lean sirloin beef strips',
      '2 cups Broccoli florets',
      '2 tbsp Low-sodium soy sauce & 1 tsp sesame oil',
      '1 tsp Minced ginger & garlic',
      '1 cup Jasmin rice'
    ],
    instructions: [
      'Heat wok/skillet with sesame oil. Add minced garlic & ginger.',
      'Flash-sear beef strips for 3 mins until browned.',
      'Add broccoli florets and 2 tbsp water; cover lid for 2 mins to steam broccoli tender-crisp.',
      'Drizzle soy sauce, toss well, and serve over Jasmin rice.'
    ]
  }
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'q1',
    title: 'Iron Burner',
    description: 'Complete 1 Workout or Calisthenics Routine',
    target: 1,
    current: 0,
    unit: 'workout',
    xpReward: 150,
    coinsReward: 40,
    completed: false,
    category: 'workout'
  },
  {
    id: 'q2',
    title: 'Protein Pioneer',
    description: 'Log at least 100g of protein today',
    target: 100,
    current: 48,
    unit: 'g',
    xpReward: 100,
    coinsReward: 30,
    completed: false,
    category: 'nutrition'
  },
  {
    id: 'q3',
    title: 'Hydration Overdrive',
    description: 'Drink 2.5 Liters of water throughout the day',
    target: 2.5,
    current: 1.8,
    unit: 'L',
    xpReward: 80,
    coinsReward: 20,
    completed: false,
    category: 'water'
  },
  {
    id: 'q4',
    title: 'Community Cheerleader',
    description: 'Give a Cheer or Like on 2 Social Posts',
    target: 2,
    current: 1,
    unit: 'cheers',
    xpReward: 50,
    coinsReward: 15,
    completed: false,
    category: 'social'
  }
];

export const INITIAL_PROGRESS_LOGS: ProgressLog[] = [
  { id: 'l1', date: '2026-07-23', weightKg: 75.2, caloriesBurned: 320, waterIntakeLiters: 2.2, workoutsCount: 1, xpGained: 180 },
  { id: 'l2', date: '2026-07-25', weightKg: 75.0, caloriesBurned: 410, waterIntakeLiters: 2.8, workoutsCount: 1, xpGained: 220 },
  { id: 'l3', date: '2026-07-27', weightKg: 74.8, caloriesBurned: 290, waterIntakeLiters: 2.4, workoutsCount: 1, xpGained: 150 },
  { id: 'l4', date: '2026-07-29', weightKg: 74.5, caloriesBurned: 520, waterIntakeLiters: 3.0, workoutsCount: 2, xpGained: 340 },
  { id: 'l5', date: '2026-07-31', weightKg: 74.3, caloriesBurned: 350, waterIntakeLiters: 2.5, workoutsCount: 1, xpGained: 200 },
  { id: 'l6', date: '2026-08-02', weightKg: 74.1, caloriesBurned: 460, waterIntakeLiters: 2.7, workoutsCount: 1, xpGained: 260 },
  { id: 'l7', date: '2026-08-04', weightKg: 74.0, caloriesBurned: 380, waterIntakeLiters: 2.8, workoutsCount: 1, xpGained: 210 },
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    authorName: 'Marcus "Apex" Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    authorLevel: 14,
    timestamp: '2 hours ago',
    postType: 'workout_complete',
    content: 'Just smashed the 25-Min Hypertrophy Dumbbell Routine! Squeezed out 12 reps on the last goblet squat set. Feeling unstoppable today! 💪🔥',
    statsHighlight: {
      label: 'Workout Stats',
      value: '25 Mins • 320 kcal • +200 XP'
    },
    likesCount: 18,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        text: 'Insane form Marcus! Keep dominating those squats!',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    authorLevel: 9,
    timestamp: '4 hours ago',
    postType: 'recipe_share',
    content: 'Cooked the 15-Minute Chipotle Garlic Chicken Bowl for post-workout meal prep. 48g of clean protein and tastes better than restaurant takeout! 🥑🍗',
    statsHighlight: {
      label: 'Nutrition Score',
      value: '48g Protein • 520 kcal'
    },
    likesCount: 24,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-3',
    authorName: 'David K.',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    authorLevel: 12,
    timestamp: 'Yesterday',
    postType: 'level_up',
    content: 'LEVEL UP ANNOUNCEMENT! Just reached Level 12 - Steel Champion status! ⚔️ Huge shoutout to this community for keeping my active streak alive!',
    statsHighlight: {
      label: 'New Badge Unlocked',
      value: 'Steel Champion Rank 👑'
    },
    likesCount: 42,
    isLiked: false,
    comments: [
      {
        id: 'c2',
        authorName: 'Alex Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        text: 'Congrats David!! Steel Champion looks awesome on your profile!',
        timestamp: 'Yesterday'
      }
    ]
  }
];
