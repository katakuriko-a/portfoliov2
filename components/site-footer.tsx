import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
export default function SiteFooter({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container mx-auto py-10 md:py-0 md:h-20">
        <p className="text-center text-sm md:text-left">
          Build by {""}
          <Link
            href={siteConfig.links.x}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Kua Kobayashi
          </Link>{" "}
          . Hosted on {""}
          <Link
            href={"https://vercel.com"}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
}
