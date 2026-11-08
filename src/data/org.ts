/**
 * Company structure — rendered as an HTML/CSS org diagram (never an image, so
 * it stays readable, selectable and translatable). Used in two places: the
 * /about "Structure" section and /team "What each function owns". One
 * component, two placements.
 *
 * [TODO-CLIENT] The departments and what each one owns. Empty until supplied:
 * OrgDiagram renders nothing and the /about section that holds it is omitted.
 * The previous site's structure belonged to another company and is not carried
 * over.
 */

export interface Division {
  name: string;
  /** What the division owns, rendered as a mono list inside the box. */
  owns: string[];
}

export const ORG_HEAD = {
  name: 'Management',
  note: 'Overall direction and oversight of daily operations.',
};

export const DIVISIONS: Division[] = [];

/** Introduces the diagram. [TODO-CLIENT] Supply with the structure. */
export const ORG_INTRO = '';

/* ------------------------------------------------------------------ *
 * Governance in practice — /team. [TODO-CLIENT] Supply.
 * ------------------------------------------------------------------ */

export const GOVERNANCE_PRACTICE: { title: string; description: string }[] = [];

/* ------------------------------------------------------------------ *
 * Careers — /team, dark band. Renders only when CAREERS_COPY is set.
 * [TODO-CLIENT] Supply the roles the business hires for and how to apply.
 * ------------------------------------------------------------------ */

export const CAREERS_COPY = '';

export const CAREERS_BLOCKS: { title: string; points: string[] }[] = [];
