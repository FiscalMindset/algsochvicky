import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

const buttonStyles = cva(
  "inline-flex max-w-full min-w-0 items-center justify-center gap-2 rounded-full border text-sm font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-accent/40 bg-accent/15 text-ink hover:bg-accent/22",
        secondary: "border-line/80 bg-white/0 text-ink hover:border-accent/35 hover:bg-white/5",
        ghost: "border-transparent bg-transparent text-muted hover:text-ink"
      },
      size: {
        md: "h-11 px-5",
        lg: "h-12 px-6",
        sm: "h-9 px-4 text-xs"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

type SharedProps = VariantProps<typeof buttonStyles> & {
  className?: string;
  children: ReactNode;
};

type LinkProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

function isLinkProps(props: LinkProps | ButtonProps): props is LinkProps {
  return typeof (props as LinkProps).href === "string";
}

export function Button(props: LinkProps | ButtonProps) {
  const className = cn(buttonStyles({ variant: props.variant, size: props.size }), props.className);

  if (isLinkProps(props)) {
    const { children, href, className: _className, variant, size, ...rest } = props;
    const external = href.startsWith("http");
    return (
      <a
        className={className}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : undefined)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { children, className: _className, variant, size, type = "button", ...rest } = props;
  return (
    <button className={className} type={type} {...rest}>
      {children}
    </button>
  );
}
