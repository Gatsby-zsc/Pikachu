import React from "react";
import { Badge } from "./badge-custom";
import { Icons } from "@/components/icons";

interface BadgeProps {
  className: string;
}

function FirstBadge({ className }: BadgeProps) {
  return (
    <Badge className={`${className}`} variant="first">
      <Icons.logo fill="var(--logo)" />
      <p>L1</p>
    </Badge>
  );
}

function SecondBadge({ className }: BadgeProps) {
  return (
    <Badge className={`${className}`} variant="secondary">
      <Icons.logo fill="var(--logo)" />
      <p>L2</p>
    </Badge>
  );
}

function ThirdBadge({ className }: BadgeProps) {
  return (
    <Badge className={`${className}`} variant="third">
      <Icons.logo fill="var(--logo)" />
      <p>L3</p>
    </Badge>
  );
}

export { FirstBadge, SecondBadge, ThirdBadge };
