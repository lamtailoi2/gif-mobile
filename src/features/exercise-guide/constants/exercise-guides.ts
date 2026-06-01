import { IExerciseGuide } from "../types/guide";

/**
 * Hardcoded exercise guides
 * Maps exercise IDs to their execution guides, mistakes, and alternatives
 */
export const EXERCISE_GUIDES: Record<string, IExerciseGuide> = {
  "1": {
    exerciseId: "1",
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: ["gluteal"],
    executionSteps: [
      {
        step: 1,
        title: "Bar Positioning",
        description:
          "Place the bar on your upper back or mid-back. Grip firmly with elbows high for high bar position.",
      },
      {
        step: 2,
        title: "Descent",
        description:
          "Descend by bending knees and hips simultaneously. Keep chest upright and knees tracking over toes.",
      },
      {
        step: 3,
        title: "Bottom Position",
        description:
          "Reach a depth where your hip crease is level with or below parallel. Maintain neutral spine and core tension.",
      },
      {
        step: 4,
        title: "Ascent",
        description:
          "Drive through heels, extending hips and knees simultaneously. Maintain upright torso position.",
      },
    ],
    mistakes: [
      {
        title: "Knees caving inward",
        description:
          "Valgus collapse indicates weak glutes or poor motor control. Focus on 'screwing feet' into ground.",
        icon: "priority_high",
      },
      {
        title: "Forward lean",
        description:
          "Excessive forward lean shifts load away from legs. Use ankle mobility work if needed.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Leg Press",
        description: "Machine-based alternative with less stability demand.",
        type: "easier",
      },
      {
        name: "Pause Squat",
        description: "Extended time under tension builds strength.",
        type: "harder",
      },
      {
        name: "Bodyweight Squat",
        description: "Perfect for home workouts and mobility.",
        type: "home",
      },
    ],
  },

  "2": {
    exerciseId: "2",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["biceps"],
    executionSteps: [
      {
        step: 1,
        title: "Setup Position",
        description:
          "Grab the pull-up bar with hands slightly wider than shoulder-width. Use an overhand grip (pronated).",
      },
      {
        step: 2,
        title: "Initiate Descent",
        description:
          "Begin by engaging your lats and pulling your elbows down and back. Lead with the chest, not the hands.",
      },
      {
        step: 3,
        title: "Pull to Chest",
        description:
          "Continue pulling until your chest nears the bar. Squeeze your back muscles at the top position.",
      },
      {
        step: 4,
        title: "Controlled Descent",
        description:
          "Lower yourself with control, extending your arms fully at the bottom. Maintain tension throughout.",
      },
    ],
    mistakes: [
      {
        title: "Pulling with arms only",
        description:
          "Using primarily biceps instead of lats reduces effectiveness. Focus on pulling elbows down.",
        icon: "priority_high",
      },
      {
        title: "Incomplete range of motion",
        description:
          "Not fully extending or not reaching full height limits muscle activation.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Lat Pulldown Machine",
        description: "Assisted version that allows progression building.",
        type: "easier",
      },
      {
        name: "Weighted Pull-ups",
        description: "Add weight belt for increased difficulty.",
        type: "harder",
      },
      {
        name: "Resistance Band Pull-ups",
        description: "Use bands for assisted pull-ups at home.",
        type: "home",
      },
    ],
  },

  "3": {
    exerciseId: "3",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["trapezius", "biceps", "forearm"],
    executionSteps: [
      {
        step: 1,
        title: "Seat Setup",
        description:
          "Adjust seat height so handles align with middle chest. Sit upright with core engaged.",
      },
      {
        step: 2,
        title: "Grip and Initial Pull",
        description:
          "Grip the handles with a neutral grip. Pull the handle toward your torso by driving elbows down and back.",
      },
      {
        step: 3,
        title: "Peak Contraction",
        description:
          "Bring the handle to chest level. Squeeze your back muscles and hold briefly for maximum contraction.",
      },
      {
        step: 4,
        title: "Controlled Return",
        description:
          "Extend your arms slowly, maintaining tension. Return to starting position with control.",
      },
    ],
    mistakes: [
      {
        title: "Using arms instead of back",
        description:
          "Flexing shoulders rather than engaging lats reduces back activation. Focus on pulling elbows.",
        icon: "priority_high",
      },
      {
        title: "Incomplete range of motion",
        description:
          "Partial reps limit effectiveness. Pull the handle all the way to chest.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Assisted Lat Pulldown",
        description: "Machine with assist for lighter loads.",
        type: "easier",
      },
      {
        name: "Single-Arm Pulldown",
        description: "Increases stability demand and unilateral strength.",
        type: "harder",
      },
      {
        name: "Resistance Band Lat Pulldown",
        description: "Home-friendly version using bands.",
        type: "home",
      },
    ],
  },

  "4": {
    exerciseId: "4",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["trapezius", "lower-back", "biceps", "forearm"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Stand with feet hip-width apart, knees slightly bent. Grip the bar shoulder-width with overhand grip.",
      },
      {
        step: 2,
        title: "Lift Off",
        description:
          "Drive through your legs to bring the bar up your body. Keep it close to your torso throughout.",
      },
      {
        step: 3,
        title: "Retraction",
        description:
          "Pull your elbows back and drive them toward your hips. Squeeze your back muscles intensely.",
      },
      {
        step: 4,
        title: "Controlled Descent",
        description:
          "Lower the bar with control, maintaining tension. Return to starting position before next rep.",
      },
    ],
    mistakes: [
      {
        title: "Bar drifting away from body",
        description:
          "Losing bar path increases shoulder strain. Keep bar close throughout movement.",
        icon: "priority_high",
      },
      {
        title: "Rounding lower back",
        description:
          "Spinal flexion risks injury and reduces power. Maintain neutral spine.",
        icon: "priority_high",
      },
    ],
    alternatives: [
      {
        name: "Dumbbell Row",
        description: "Single-arm variation for unilateral strength.",
        type: "easier",
      },
      {
        name: "Deficit Barbell Row",
        description: "Increased range of motion for greater gains.",
        type: "harder",
      },
      {
        name: "Inverted Row (Bodyweight)",
        description: "Home-friendly alternative using a bar.",
        type: "home",
      },
    ],
  },

  "5": {
    exerciseId: "5",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "deltoids"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Lay flat on the bench, feet planted firmly on the floor. Ensure your eyes are positioned directly under the bar.",
      },
      {
        step: 2,
        title: "Movement Execution",
        description:
          "Lower the bar slowly toward your mid-chest. Keep elbows tucked at roughly a 45-degree angle from torso.",
      },
      {
        step: 3,
        title: "Peak Contraction",
        description:
          "Briefly pause as the bar touches your chest. Avoid bouncing and maintain full-body tension.",
      },
      {
        step: 4,
        title: "Return Motion",
        description:
          "Press the bar back up with explosive power until arms are fully extended but not hyper-locked.",
      },
    ],
    mistakes: [
      {
        title: "Bouncing off chest",
        description:
          "Losing control at bottom reduces chest activation and risks injury.",
        icon: "priority_high",
      },
      {
        title: "Elbows flaring too wide",
        description:
          "Excessive flare shifts tension to shoulders and increases injury risk. Maintain 45-degree angle.",
        icon: "priority_high",
      },
    ],
    alternatives: [
      {
        name: "Dumbbell Bench Press",
        description: "Greater range of motion and stabilizer focus.",
        type: "easier",
      },
      {
        name: "Pause Bench Press",
        description: "Builds explosive power from a dead stop.",
        type: "harder",
      },
      {
        name: "Floor Press (Dumbbells)",
        description: "Limits range of motion for shoulder safety.",
        type: "home",
      },
    ],
  },

  "6": {
    exerciseId: "6",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "deltoids"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Start in a plank position with hands slightly wider than shoulder-width, body in a straight line.",
      },
      {
        step: 2,
        title: "Descent",
        description:
          "Lower your body by bending elbows, keeping them tucked close to your torso. Lower until chest nearly touches floor.",
      },
      {
        step: 3,
        title: "Bottom Position",
        description:
          "Pause briefly when chest is close to the floor. Maintain a rigid body position throughout.",
      },
      {
        step: 4,
        title: "Push Back Up",
        description:
          "Drive through your hands to push yourself back to starting position. Lock out arms fully.",
      },
    ],
    mistakes: [
      {
        title: "Hips sagging",
        description:
          "Loss of body tension shifts work away from chest. Keep body rigid and core engaged.",
        icon: "priority_high",
      },
      {
        title: "Incomplete range of motion",
        description:
          "Partial reps reduce effectiveness. Lower until chest nearly touches floor.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Wall Push-up",
        description: "Easier regression for beginners.",
        type: "easier",
      },
      {
        name: "Diamond Push-up",
        description: "Increased difficulty with hand placement.",
        type: "harder",
      },
      {
        name: "Incline Push-up",
        description: "Hands elevated for easier variation.",
        type: "home",
      },
    ],
  },

  "7": {
    exerciseId: "7",
    primaryMuscles: ["hamstring"],
    secondaryMuscles: ["gluteal", "lower-back", "trapezius"],
    executionSteps: [
      {
        step: 1,
        title: "Setup Position",
        description:
          "Stand with feet hip-width apart, shins nearly touching the bar. Grip at shoulder-width, arms straight.",
      },
      {
        step: 2,
        title: "Initial Pull",
        description:
          "Drive through your heels while maintaining neutral spine. Keep the bar close to your body as you lift.",
      },
      {
        step: 3,
        title: "Lockout",
        description:
          "Stand tall at the top, fully extending hips and knees. Squeeze your glutes at the peak position.",
      },
      {
        step: 4,
        title: "Descent",
        description:
          "Lower the bar with control by hinging at the hips, keeping the bar close to your legs.",
      },
    ],
    mistakes: [
      {
        title: "Rounding the back",
        description:
          "Spinal flexion under load risks serious injury. Maintain neutral spine throughout.",
        icon: "priority_high",
      },
      {
        title: "Bar drifting away",
        description:
          "Losing bar control increases lower back strain. Keep bar over mid-foot at all times.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Trap Bar Deadlift",
        description: "Reduces lower back strain with neutral grip.",
        type: "easier",
      },
      {
        name: "Deficit Deadlift",
        description: "Increases range of motion for greater gains.",
        type: "harder",
      },
      {
        name: "Romanian Deadlift",
        description: "Home-friendly posterior chain emphasis.",
        type: "home",
      },
    ],
  },

  "8": {
    exerciseId: "8",
    primaryMuscles: ["deltoids"],
    secondaryMuscles: ["triceps", "trapezius"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Stand holding dumbbells at shoulder height with elbows bent. Palms facing forward, core engaged.",
      },
      {
        step: 2,
        title: "Press Upward",
        description:
          "Drive the dumbbells overhead in a controlled manner. Follow a slight arc, not straight up.",
      },
      {
        step: 3,
        title: "Lockout",
        description:
          "Fully extend arms overhead until dumbbells are aligned above shoulders. Squeeze deltoids at top.",
      },
      {
        step: 4,
        title: "Controlled Descent",
        description:
          "Lower dumbbells back to shoulder height with control. Maintain tension throughout.",
      },
    ],
    mistakes: [
      {
        title: "Arching lower back excessively",
        description:
          "Loss of core stability can lead to lower back strain. Maintain neutral spine.",
        icon: "priority_high",
      },
      {
        title: "Asymmetrical lockout",
        description:
          "One arm extending before the other indicates strength imbalance. Focus on symmetry.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Machine Shoulder Press",
        description: "Reduced stability demand for easier pressing.",
        type: "easier",
      },
      {
        name: "Barbell Shoulder Press",
        description: "Increased stability requirement for greater challenge.",
        type: "harder",
      },
      {
        name: "Pike Push-up",
        description: "Bodyweight shoulder press variation at home.",
        type: "home",
      },
    ],
  },

  "9": {
    exerciseId: "9",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearm"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Stand with feet hip-width apart holding dumbbells at sides. Arms fully extended, palms facing forward.",
      },
      {
        step: 2,
        title: "Curl Upward",
        description:
          "Bend your elbows and curl dumbbells toward shoulders. Keep elbows stationary at your sides.",
      },
      {
        step: 3,
        title: "Peak Contraction",
        description:
          "Bring dumbbells to shoulder height. Squeeze your biceps hard and briefly pause.",
      },
      {
        step: 4,
        title: "Controlled Descent",
        description:
          "Lower dumbbells back to starting position with control. Maintain tension during descent.",
      },
    ],
    mistakes: [
      {
        title: "Swinging the weight",
        description:
          "Using momentum from body swing reduces bicep activation. Use strict form with controlled movement.",
        icon: "priority_high",
      },
      {
        title: "Elbows moving forward",
        description:
          "Drifting elbows away from body shifts work to shoulders. Keep elbows pinned to sides.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Barbell Curl",
        description: "Heavier loading with bilateral movement.",
        type: "easier",
      },
      {
        name: "Single-Arm Dumbbell Curl",
        description: "Unilateral focus for strength balance.",
        type: "harder",
      },
      {
        name: "Resistance Band Curl",
        description: "Home-friendly portable alternative.",
        type: "home",
      },
    ],
  },

  "10": {
    exerciseId: "10",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques", "lower-back"],
    executionSteps: [
      {
        step: 1,
        title: "Starting Position",
        description:
          "Get into a forearm plank position. Elbows directly under shoulders, body in straight line.",
      },
      {
        step: 2,
        title: "Core Engagement",
        description:
          "Engage your core and glutes. Maintain neutral spine throughout the entire hold.",
      },
      {
        step: 3,
        title: "Tension Maintenance",
        description:
          "Keep tension in abs, glutes, and shoulders. Breathe steadily - do not hold your breath.",
      },
      {
        step: 4,
        title: "Hold Duration",
        description:
          "Hold this position for the prescribed time. Maintain form quality over duration.",
      },
    ],
    mistakes: [
      {
        title: "Hips sagging",
        description:
          "Loss of tension shifts stress to lower back. Keep hips level with shoulders and heels.",
        icon: "priority_high",
      },
      {
        title: "Holding breath",
        description:
          "Breath-holding increases intra-abdominal pressure dangerously. Breathe steadily throughout.",
        icon: "close",
      },
    ],
    alternatives: [
      {
        name: "Wall Plank",
        description: "Hands on wall for easier regression.",
        type: "easier",
      },
      {
        name: "Side Plank",
        description: "Unilateral variation targeting obliques.",
        type: "harder",
      },
      {
        name: "Wall Sit",
        description: "Bodyweight leg and core exercise at home.",
        type: "home",
      },
    ],
  },
};

/**
 * Get exercise guide by ID
 * Returns default guide if not found
 */
export const getExerciseGuide = (exerciseId: string): IExerciseGuide | null => {
  return EXERCISE_GUIDES[exerciseId] || null;
};
