import type { Component } from "solid-js";
import { Bug, Hammer, Server } from "@/components/icons";
import { IconArchestra } from "./IconArchestra";
import { IconClaudeCode } from "./IconClaudeCode";
import { IconContext7 } from "./IconContext7";
import { IconGitHub } from "./IconGitHub";
import { IconJira } from "./IconJira";
import { IconKubernetes } from "./IconKubernetes";
import { IconPlaywright } from "./IconPlaywright";

type IconComponent = Component<{ size?: number; class?: string }>;

const wellKnown: Record<string, IconComponent> = {
    archestra: IconArchestra,
    "claude code": IconClaudeCode,
    context7: IconContext7,
    github: IconGitHub,
    jira: IconJira,
    kubernetes: IconKubernetes,
    k8s: IconKubernetes,
    playwright: IconPlaywright,
};

const builtIn: Record<string, IconComponent> = {
    "internal-dev": Hammer,
    coding: Bug,
};

export const defaultIcon: IconComponent = Server;

export function getIcon(name: string): IconComponent {
    const key = name.toLowerCase();
    const dictionary = { ...wellKnown, ...builtIn };
    for (const [pattern, icon] of Object.entries(dictionary)) {
        if (key.includes(pattern)) {
            return icon;
        }
    }
    return defaultIcon;
}

export function isWellKnownIcon(name: string): boolean {
    const key = name.toLowerCase();
    const entry = Object.keys(wellKnown).find((pattern) => {
        return key.includes(pattern);
    });
    return Boolean(entry);
}
