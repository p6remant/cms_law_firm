import { ArrowUpRight } from 'lucide-react';
import { type ResolvedCTAButton } from '@/features/editor/utils/cta-utils';

export function CTAActionLink({ button, classes }: { button: ResolvedCTAButton; classes: string }) {
  return (
    <a
      href={button.href}
      target={button.target}
      rel={button.rel}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium tracking-normal ${classes}`}
    >
      <span>{button.text}</span>
      {button.isExternal && (
        <>
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only"> (opens in new tab)</span>
        </>
      )}
    </a>
  );
}
