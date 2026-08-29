import Link from "next/link";
import { FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { SiXiaohongshu } from "react-icons/si";
import { HiOutlineEnvelope } from "react-icons/hi2";

import Avatar from "@/components/Avatar";
import Tagline from "@/components/Tagline";
import Wordmark from "@/components/Wordmark";
import { SITE } from "@/lib/site";

const socials = [
  { name: "Instagram", href: SITE.instagram, Icon: FaInstagram },
  { name: "X", href: SITE.x, Icon: FaXTwitter },
  { name: "小红书", href: SITE.xiaohongshu, Icon: SiXiaohongshu },
  { name: "GitHub", href: SITE.github, Icon: FaGithub },
  { name: "Email", href: `mailto:${SITE.email}`, Icon: HiOutlineEnvelope },
];

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 px-6 pb-24 text-center">
      <Avatar />

      <p
        className="kc-rise text-[11px] font-medium tracking-[0.16em] text-[var(--fg-3)] uppercase"
        style={{ animationDelay: "160ms" }}
      >
        {SITE.place}
      </p>

      <Wordmark text={SITE.name} />

      <div className="kc-rise" style={{ animationDelay: "760ms" }}>
        <Tagline text={SITE.tagline} />
      </div>

      <div
        className="kc-rise flex items-center gap-7"
        style={{ animationDelay: "860ms" }}
      >
        {socials.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={name}
            className="text-[var(--fg-3)] transition-colors duration-300 hover:text-[var(--fg)]"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        ))}
      </div>

      <Link
        href="/focus"
        className="kc-rise group mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent)]"
        style={{ animationDelay: "960ms" }}
      >
        This year, in numbers
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </main>
  );
}
