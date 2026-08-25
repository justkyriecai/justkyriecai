import { FaInstagram, FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/justkyriecai",
    Icon: FaInstagram,
  },
  { name: "X (Twitter)", href: "https://x.com/justkyriecai", Icon: FaXTwitter },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center">
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl md:text-9xl">
        Kyrie Cai
      </h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl">
        make something people want
      </p>
      <div className="flex items-center gap-6">
        {socials.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </main>
  );
}
