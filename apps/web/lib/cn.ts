/**
 * Minimal className joiner — no clsx/tailwind-merge dep yet.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}
