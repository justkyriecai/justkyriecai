export type Project = {
  name: string;
  blurb: string;
  href: string;
  /** the right-hand column: a domain for products, a repo path for code */
  label: string;
  stars?: number;
  lang?: string;
};

/** The one the year is riding on. */
export const BUILDING: Project[] = [
  {
    name: "Trio",
    blurb: "The bet. A town where three is company.",
    href: "https://trio.town",
    label: "trio.town",
  },
];

/** Things I put on, rather than things I shipped. */
export const ACTIVITY: Project[] = [
  {
    name: "Launchpad",
    blurb:
      "Three days to do three months of go-to-market — what a hackathon starts, this finishes. S1 in Shanghai with DeepTech, 100 seats; Hangzhou next, then Silicon Valley.",
    href: "https://mp.weixin.qq.com/s/sqLDwIx5NUw2SCJRNlzA2w",
    label: "MAL.LAB",
  },
];

/** Everything public on github.com/justkyriecai. */
export const OPEN_SOURCE: Project[] = [
  {
    name: "can-rent-lah",
    blurb:
      "An AI agent toolkit for renting in Singapore — turns PropertyGuru into a CLI, then handles the rest of the lease.",
    href: "https://github.com/justkyriecai/can-rent-lah",
    label: "can-rent-lah",
    stars: 12,
    lang: "JavaScript",
  },
  {
    name: "deepseek-tag",
    blurb:
      "Brings DeepSeek Harness agents into Feishu and Lark over the platform's WebSocket connection. No webhook, no proxy.",
    href: "https://github.com/justkyriecai/deepseek-tag",
    label: "deepseek-tag",
    stars: 5,
    lang: "TypeScript",
  },
  {
    name: "DamNUS",
    blurb:
      "One CLI to damn them all in NUS — Canvas, NUSMods and NSWS on a single command surface.",
    href: "https://github.com/justkyriecai/DamNUS",
    label: "DamNUS",
    stars: 2,
    lang: "JavaScript",
  },
  {
    name: "kbrain",
    blurb: "kyriecai's brain, versioned.",
    href: "https://github.com/justkyriecai/kbrain",
    label: "kbrain",
    stars: 0,
  },
  {
    name: "kyriecai.me",
    blurb: "This site. Five rooms and a year-long scoreboard.",
    href: "https://github.com/justkyriecai/justkyriecai",
    label: "justkyriecai",
    stars: 0,
    lang: "TypeScript",
  },
];
