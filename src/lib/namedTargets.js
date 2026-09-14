/* Named targets on a Deal Network intake: the specific clubs, leagues, federations, or
 * companies an applicant wants to meet. The intake stores them as a list, the backend
 * validates that list the same way on the public application and on the portal brief (at
 * most 25 targets, each at most 200 characters), and the admin edits it as tags, one tag
 * per target.
 *
 * Both forms collect the list in a textarea, one target per line, so a new line is the only
 * separator and a comma stays part of its entry. People write a reason beside a name ("Inter
 * Miami CF, international profile and strong commercial reach") and some legal names carry a
 * comma ("Kroenke Sports & Entertainment, LLC"). Splitting on commas too saved those as
 * fragments, and the backend compatibility scorer's named-target signal, which looks for the
 * other member's company name inside each target, cannot find a name that a comma cut in two.
 *
 * Other list fields are different: "Leagues or competitions of interest" is a one-line input
 * where commas are the separator, and it keeps its own split.
 */

export const NAMED_TARGETS_MAX = 25
export const NAMED_TARGET_MAX_LENGTH = 200

/** One target per non-blank line, trimmed. */
export function parseNamedTargets(text) {
  return String(text ?? '').split('\n').map((line) => line.trim()).filter(Boolean)
}

/**
 * The reason this list would not save, or '' when it would.
 *
 * The backend refuses the whole submission when a single target breaks a limit, so the forms
 * check first and name the entry at fault. A paragraph typed without line breaks arrives as
 * one target, and applicants do write paragraphs in this box.
 */
export function namedTargetsProblem(text) {
  const targets = parseNamedTargets(text)

  const long = targets.find((target) => target.length > NAMED_TARGET_MAX_LENGTH)
  if (long) {
    return `“${long.slice(0, 30).trimEnd()}…” is ${long.length} characters, and each target can be up to ${NAMED_TARGET_MAX_LENGTH}.`
  }

  if (targets.length > NAMED_TARGETS_MAX) {
    return `This list has ${targets.length} targets, and the limit is ${NAMED_TARGETS_MAX}.`
  }

  return ''
}
