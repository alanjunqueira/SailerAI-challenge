import { type ComponentProps, type ReactNode } from "react";

import {
  TooltipContentProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import { cn } from "@/lib/utils";

interface IHintProps extends ComponentProps<typeof Tooltip> {
  text: string;
  children: ReactNode;
  asChild?: TooltipTriggerProps["asChild"];
  side?: TooltipContentProps["side"];
  align?: TooltipContentProps["align"];
  delayDuration?: number;
  contentClassName?: string;
  triggerClassName?: string;
  textClassName?: string;
}

export const Hint = ({
  text,
  children,
  asChild,
  side,
  align,
  delayDuration = 0,
  triggerClassName,
  contentClassName,
  textClassName,
  ...props
}: IHintProps) => {
  return (
    <Tooltip delayDuration={delayDuration} {...props}>
      <TooltipTrigger asChild={asChild} className={triggerClassName}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} className={contentClassName}>
        <p className={cn("font-medium", textClassName)}>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
