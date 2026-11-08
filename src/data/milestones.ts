/**
 * Company milestones.
 *
 * [TODO-CLIENT] Supply the dates. The timeline component on /about is built and
 * wired, but this array is deliberately empty: the section does not render
 * while it is, and no founding date, expansion year or headcount figure has
 * been invented to fill it. Add entries in chronological order and the section
 * appears with no further code change.
 *
 * Example of the shape expected:
 *   { year: '2014', title: 'Company incorporated', description: '…' },
 */

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const MILESTONES: Milestone[] = [];
