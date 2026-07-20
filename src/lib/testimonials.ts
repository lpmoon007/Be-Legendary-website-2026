// Real client testimonials (single source of truth for both the visual
// Testimonials section and the Review JSON-LD). Verbatim quotes.
export interface Testimonial {
  quote: string;
  name: string;
  role: string; // title / organization
}

export const TESTIMONIALS: Testimonial[] = [
  // Featured first: a named C-suite voice for the executive-team pages (the
  // ProofStrip defaults to index 0). Keeps the exec-team proof matched to the
  // exec-team buyer, instead of a team-building/workshop quote.
  {
    quote:
      'This truly resonated and will have a lasting influence on us as we work to create a technology organization where the best and brightest choose to be.',
    name: 'Larry Quinlan',
    role: 'Global CIO, Deloitte',
  },
  {
    quote:
      'James Carter has a great way of capturing your attention with his thought-provoking activities and messages. You walk away feeling inspired to grow yourself, help others, and, as James would say, “Be Legendary.”',
    name: 'Mark Williams',
    role: 'Coakley & Williams Hotel Management',
  },
  {
    quote:
      'A very creative, talented and trustworthy man. He combines a highly regarded training company with a social conscience and a sincere desire to help others. I strongly recommend him to anyone seeking an original, innovative approach.',
    name: 'David Gerard',
    role: 'Owner, Gerard & Associates',
  },
  {
    quote:
      'Oh my goodness! In my work-life, nothing I have attended compared to today. Thank you for allowing the DRS team to be part of such a meaningful and memorable session.',
    name: 'David Brine',
    role: 'Washington DRS',
  },
  {
    quote:
      'We had 35 people and broke them into two groups for our China Syndrome session. There was a great deal of learning, and it was an excellent way to break up their strategy session. One gentleman was still talking about it the next day.',
    name: 'Monica Le Grand Trudell',
    role: 'Peak Performance Associates',
  },
  {
    quote:
      'The tools, facilitator guide and support materials are fantastic — self-explanatory and easy to follow. The activities facilitate the group’s discussion without prompts, unearthing the behaviours that play out in day-to-day team interactions.',
    name: 'Andrew Mifsud',
    role: 'Organisational Development, Melton Shire Council · Australia',
  },
  {
    quote:
      'Our team building day went extremely well. We used the Team Shackles and Chain of Command exercises. The group had a great time and learned helpful insights about how they work and communicate with others.',
    name: 'Victoria M. Garcia, M.S.',
    role: 'Big Brothers Big Sisters of Orange County',
  },
  {
    quote:
      'The session received rave reviews. Thanks so much for making my job a breeze and a session the attendees enjoyed. Please pass on the great news to your team — hope to work together again soon.',
    name: 'Elisa Sinclair',
    role: 'DevlinHair Productions',
  },
  {
    quote:
      'I just finished reading the evaluation comments on the bicycle exercise and they are amazing. It was absolutely amazing to see 375 children all receiving new bikes.',
    name: 'Kathie Winter',
    role: 'Administrator, DaVita University',
  },
];
