// The project's repository on GitHub, from PUBLIC_GITHUB_URL, with any
// trailing slash taken off. It is undefined while that is blank or is not a web
// address, and everything that links to GitHub leaves the link out then.
const configured = (import.meta.env.PUBLIC_GITHUB_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export const githubUrl: string | undefined =
  URL.canParse(configured) && new URL(configured).protocol.startsWith("http")
    ? configured
    : undefined;
