import * as React from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

type SpinnerProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "icon"
>;

function Spinner({ className, strokeWidth = 2, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      className={cn("animate-spin", className)}
      icon={Loading03Icon}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

export { Spinner };
