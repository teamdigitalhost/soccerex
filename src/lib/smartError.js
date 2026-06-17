/* Turns an ApiError (or any thrown error) into a respectable, user-facing
 * description that still carries the technical reference we can trace.
 *
 * tone:
 *   'server' — not the user's fault (network, 5xx, provider outage). Reassure
 *              and offer retry; show the reference if we have one.
 *   'warn'   — transient/expected (rate limit). Ask them to wait.
 *   'user'   — something they can fix (validation, expired link). Show the
 *              specific message.
 *
 * Returns { tone, title, message, reference }.
 */
export function describeError(err, fallback = 'Something went wrong. Please try again.') {
  const status = err?.status
  const body = err?.body || null
  const reference = (body && body.reference) || null
  const serverMessage = body && typeof body.message === 'string' ? body.message : null

  // Couldn't reach the API at all.
  if (status === 0 || status === undefined) {
    return {
      tone: 'server',
      title: "We couldn't reach Soccerex",
      message: 'Please check your connection and try again in a moment.',
      reference: null,
    }
  }

  // Our fault — server / upstream provider failure.
  if (status >= 500) {
    return {
      tone: 'server',
      title: 'Something went wrong on our end',
      message: serverMessage || 'This is on our side, not yours. Please try again in a moment.',
      reference,
    }
  }

  // Too many attempts.
  if (status === 429) {
    return {
      tone: 'warn',
      title: 'One moment',
      message: serverMessage || 'That was a lot of attempts in a row. Please wait a minute and try again.',
      reference,
    }
  }

  // Their side — validation, expired link, etc. Show the specific reason.
  return {
    tone: 'user',
    title: null,
    message: serverMessage || err?.message || fallback,
    reference,
  }
}
