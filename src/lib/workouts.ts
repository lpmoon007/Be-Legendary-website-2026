// Canonical Mindset Workouts — slug, display title, and a short card blurb.
// Single source for the "More workouts" cross-link rail (MwRelated) so every
// workout links to its siblings (not just back to the gym hub).
export interface WorkoutMeta {
  slug: string;
  title: string;
  blurb: string;
}

export const WORKOUT_META: WorkoutMeta[] = [
  { slug: 'go-for-it', title: 'When Did You Last Truly Go For It?', blurb: 'Vulnerability is a strength you exercise like a muscle.' },
  { slug: 'what-the-beep', title: 'What the Beep?!', blurb: 'Challenge why you do a thing — and find the belief underneath.' },
  { slug: 'find-your-why', title: 'Find Your Why', blurb: 'The 5 Whys turned inward, to the core motivation that drives you.' },
  { slug: 'count-your-blessings', title: 'Count Your Blessings', blurb: 'Gratitude is a muscle — an antidote to the daily poison.' },
  { slug: 'legendary-intent', title: 'Legendary Intent', blurb: 'Your one-line leadership filter: “If I accomplish nothing else…”' },
  { slug: 'whats-your-story', title: 'What’s Your Story', blurb: 'Find the story running you — and rewrite it.' },
  { slug: 'villain-or-hero', title: 'Are You a Villain or a Hero?', blurb: 'Excavate the beliefs behind your proudest and least-proud moments.' },
  { slug: 'making-change-stick', title: 'Making Change Stick', blurb: 'A nine-part series on leading change that actually lasts.' },
  { slug: 'big-rocks', title: 'Big Rocks', blurb: 'Name your priorities — and schedule them before the day fills with sand.' },
  { slug: 'pre-mortem', title: 'Prevent Your Next Failure', blurb: 'Run time backward: find what killed it, then change the present.' },
  { slug: '5-whys', title: 'Discover Your Inner Strength', blurb: 'Ask why five times, inward — to the belief underneath the reaction.' },
  { slug: 'the-golden-buddha', title: 'You’ve Hidden the Best of Who You Are', blurb: 'You’re already gold — the work is subtraction.' },
  { slug: 'kintsugi-wabi-sabi', title: 'Broken Is Not the Opposite of Beautiful', blurb: 'Love a thing because of its flaws, not in spite of them.' },
  { slug: 'mindset-of-a-legend', title: 'Mindset of a Legend', blurb: 'Awareness, Beliefs, Courage — see the mindset running you, then change it.' },
  { slug: 'let-go-of-negativity', title: 'Let Go of Negativity', blurb: 'Name one grudge you’re carrying, and put it down.' },
  { slug: 'choices', title: 'Nobody Is Making You Feel This Way', blurb: 'Connect your calculating side to your purpose — and choices get simple.' },
  { slug: 'sit-down-shut-up-learn', title: 'Sit Down, Shut Up & Learn', blurb: 'Notice the lens you were taught to see the world through.' },
  { slug: 'design-your-misogi', title: 'Design Your Misogi', blurb: 'One challenge a year with a real chance of failure. The real thing.' },
];
