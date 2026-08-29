/**
 * Timeline: one node per thing that happened, newest first, bucketed by year.
 *
 * A node is a keyword and, where one exists, a single hard number. The 2026
 * entries are dated from their repos; the rest are placed by year roughly,
 * from which academic year they fell in — move a node between buckets and
 * nothing else needs touching.
 */
export type Node = {
  key: string;
  note: string;
  href?: string;
  now?: boolean;
};

export type Year = {
  year: string;
  now?: boolean;
  nodes: Node[];
};

export const YEARS: Year[] = [
  {
    year: "2026",
    now: true,
    nodes: [
      {
        key: "Trio",
        note: "10 → 2,946,326 users",
        href: "https://trio.town",
        now: true,
      },
      {
        key: "kbrain",
        note: "a brain, versioned",
        href: "https://github.com/justkyriecai/kbrain",
      },
      {
        key: "deepseek-tag",
        note: "DeepSeek Harness agents inside Feishu and Lark",
        href: "https://github.com/justkyriecai/deepseek-tag",
      },
      {
        key: "DamNUS",
        note: "three NUS systems, one command",
        href: "https://github.com/justkyriecai/DamNUS",
      },
      {
        key: "can-rent-lah",
        note: "Singapore's rental market as a CLI",
        href: "https://github.com/justkyriecai/can-rent-lah",
      },
      { key: "Hash.YS", note: "founded SYSU's blockchain association" },
      {
        key: "Launchpad",
        note: "founded the series · S1 in Shanghai, 100 seats",
        href: "https://mp.weixin.qq.com/s/sqLDwIx5NUw2SCJRNlzA2w",
      },
    ],
  },
  {
    year: "2025",
    nodes: [
      { key: "Guru", note: "ad-launch cycle, 7 days → 1" },
      { key: "YOLO", note: "800+ entrants, 300 users in 3 days" },
      { key: "Outdoc", note: "built with a SYSU Cancer Center academician" },
      { key: "Plateau", note: "RMB 500k angel round" },
      { key: "Triody", note: "HK$100k Ideation grant, incorporated in Hong Kong" },
      { key: "Lazy", note: "async sandboxed agent, six months before Manus" },
    ],
  },
  {
    year: "2024",
    nodes: [
      { key: "Anti-money-laundering", note: "National First Prize · ¥500M traced" },
      { key: "AAAI", note: "fourth author · SOTA" },
      { key: "Student union president", note: "1,200 undergraduates into labs" },
      { key: "Legal-rights startup", note: "lawyers paired with agents" },
    ],
  },
  {
    year: "2023",
    nodes: [
      { key: "Google DevFest", note: "200+ attendees" },
      { key: "Harvard summit", note: "500 people, one Trashion Show" },
      { key: "Top-Talent Base 2.0", note: "20 places a year, university-wide" },
      { key: "Cohort rank", note: "3 of 300" },
      { key: "Dodgeball", note: "the university's first · annual since" },
    ],
  },
  {
    year: "2022",
    nodes: [
      { key: "AI daily", note: "30 consecutive posts" },
      { key: "Speech contest", note: "four rounds to the final" },
    ],
  },
];
