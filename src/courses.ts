import type { LearningPath, Room } from './types';

export const engineeringPath: LearningPath = {
  id: 4, title: 'Defensive Engineering', icon: 'Shield', difficulty: 'Intermediate', duration: '3 hours',
  description: 'Work through network fundamentals, secure changes, database design, and incident triage before a multi-session capstone.',
  roomIds: [5, 6, 7, 8, 9],
};

const books = import.meta.glob<string>('./books/*.md', { eager: true, query: '?raw', import: 'default' });

const courses: Room[] = [
  {
    id: 5, title: 'Networking for Defenders', icon: 'Network', difficulty: 'Easy', duration: '25 min', users: 0,
    description: 'Trace a request through DNS, transport, and the application, then diagnose a fictional outage.', tags: ['Networking', 'Foundations'],
    video: { title: 'The Internet: Crash Course Computer Science #29', url: 'https://www.youtube.com/watch?v=AEaKrq3SpW8', guide: 'Listen for the difference between the physical network and the protocols that coordinate it. Then label those boundaries on your own request diagram.' },
    tasks: [
      { id: 1, title: 'Follow a request', content: 'DNS maps a name to an address. Transport connects endpoints, while the application protocol defines what gets sent. Sketch the journey from entering a URL to receiving a response.' },
      { id: 2, title: 'Separate symptoms from causes', content: 'In a fictional outage, one office cannot resolve a service name while another office can. Write two hypotheses and name an observation that would distinguish them.' },
      { id: 3, title: 'Who answered the request?', content: 'Draw the gateway and backend boundaries. Explain why a request can fail for the caller even when the backend logs success.' },
      { id: 4, title: 'Write the incident handoff', content: 'Draft a handoff with impact, evidence, a competing explanation, the next action, and a recovery signal.' },
    ],
  },
  {
    id: 6, title: 'Secure Change Review with Git', icon: 'Shield', difficulty: 'Medium', duration: '30 min', users: 0,
    description: 'Review changes, define release checks, and plan a safe rollback.', tags: ['Git', 'Secure delivery'],
    video: { title: 'Git and GitHub for Beginners – Crash Course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', guide: 'Focus on branches, commits, and pull requests. Pause after the pull request example and explain how you would review a permissions change.' },
    tasks: [
      { id: 1, title: 'Review the intent and the diff', content: 'A fictional pull request updates documentation and makes an unrelated access-policy change. Write a review explaining which change should be separated and why.' },
      { id: 2, title: 'Prepare a rollback', content: 'Write a release checklist with an owner, a measurable rollback trigger, and a post-rollback verification step.' },
    ],
  },
  {
    id: 7, title: 'Safe Database Design', icon: 'Code2', difficulty: 'Medium', duration: '30 min', users: 0,
    description: 'Design narrowly scoped database access and keep query structure separate from data.', tags: ['SQL', 'Least privilege'],
    video: { title: 'SQL Tutorial – Full Database Course for Beginners', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', guide: 'Use the sections on tables and queries as SQL background. Then compare the columns needed for a report with the columns available in its source table.' },
    tasks: [
      { id: 1, title: 'Model access by job', content: 'An order dashboard reads order totals but does not issue refunds. List the permissions its database identity needs, and which should belong to a separate service.' },
      { id: 2, title: 'Keep data separate from instructions', content: 'Review a fictional search feature. Describe how bound parameters, restricted sort choices, and regression tests would protect its query boundary.' },
    ],
  },
  {
    id: 8, title: 'Incident Triage with Log Analysis', icon: 'Activity', difficulty: 'Hard', duration: '35 min', users: 0,
    description: 'Build a timeline from fictional events, explain uncertainty, and define recovery criteria.', tags: ['Incident response', 'Capstone'],
    video: { title: 'Python Tutorial – Full Course for Beginners (companion for parsing log data)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', guide: 'This is a Python companion, not an incident-response lecture. If you want to process the fictional log data, focus on strings, lists, and reading files.' },
    tasks: [
      { id: 1, title: 'Build an evidence timeline', content: 'Synthetic events: 09:00 UTC release deployed; 09:03 UTC sign-in errors increase; 09:06 UTC a different service reports a timeout. Label each statement as an observation, then write one hypothesis and one missing piece of evidence.' },
      { id: 2, title: 'Write the recovery decision', content: 'Use the timeline to draft a short incident update: current impact, confidence in the suspected cause, immediate action, owner, and the next update time.' },
    ],
  },
  {
    id: 9, title: 'Capstone: The Regional Sign-in Incident', icon: 'Activity', difficulty: 'Hard', duration: '45 min', users: 0,
    description: 'Compare competing incident hypotheses and produce an evidence-based recovery report.', tags: ['Capstone', 'Incident response'],
    tasks: [
      { id: 1, title: 'Build the evidence packet', content: 'Compare failures by region and deployment cohort. Write your timeline and two competing explanations using the supplied fictional data.' },
      { id: 2, title: 'Defend the recovery plan', content: 'Write an incident report. Check it against the chapter rubric and revise one statement or recommendation before marking this session complete.' },
    ],
  },
];

export const engineeringRooms = courses.map(room => ({ ...room, tasks: room.tasks.map(task => ({
  ...task, reading: books[`./books/${room.id}-${task.id}.md`],
})) }));
