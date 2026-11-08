export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Initials used by the monogram placeholder when no photograph is supplied. */
  initials: string;
  photo: string;
  photoAlt: string;
  /** Short line for the card and the homepage leadership preview. */
  summary: string;
  /** Full bio shown in the modal. */
  bio: string[];
  credentials: string[];
  /** The chief executive gets a dedicated feature block ahead of the grid. */
  featured: boolean;
}

/**
 * [TODO-CLIENT] The management team: names, roles, biographies, credentials
 * and portraits, with each person's permission to publish.
 *
 * Empty until supplied. While it is empty, /team returns a 404, is left out of
 * the navigation, the footer and the sitemap, and the homepage leadership
 * preview does not render. Add entries and all of that switches back on; the
 * sitemap is the one manual step — remove '/team' from the `exclude` array in
 * next-sitemap.config.js.
 *
 * Portraits go in /public/images/team/ at 4:5, 800x1000. Until a file lands,
 * TeamCard renders a monogram tile — never a stock photograph of a stranger
 * standing in for a named person.
 *
 * Shape expected:
 *   {
 *     slug: 'firstname-lastname',
 *     name: 'Full Name',
 *     role: 'Role title',
 *     initials: 'FL',
 *     photo: '/images/team/team-firstname-lastname.jpg',
 *     photoAlt: 'Portrait of Full Name, Role title at 4Jasmine Dr',
 *     summary: 'One line on what they own.',
 *     bio: ['Paragraph one.', 'Paragraph two.'],
 *     credentials: ['Qualification, Institution'],
 *     featured: false,
 *   }
 */
export const TEAM: TeamMember[] = [];

export const TEAM_PUBLISHED = TEAM.length > 0;

export const CEO: TeamMember | undefined = TEAM.find((member) => member.featured);
export const MANAGERS = TEAM.filter((member) => !member.featured);

/**
 * [TODO-CLIENT] A statement from the chief executive, in their own words and
 * approved by them. The /about section that shows it renders only when both
 * this and a featured team member exist — an unattributed or ghost-written
 * leadership quote is worse than none.
 */
export const CEO_STATEMENT: string | null = null;
