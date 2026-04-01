export function getMcpOptionCardClassNames(params: {
    selected?: boolean;
    class?: string;
    baseClassName: string;
    selectedClassName: string;
}): string {
    const classes = [params.baseClassName];

    if (params.selected) {
        classes.push(params.selectedClassName);
    }
    if (params.class) {
        classes.push(params.class);
    }

    return classes.join(" ");
}

export function shouldShowMcpOptionSelectedIndicator(params: {
    selected?: boolean;
    hasEndContent: boolean;
}): boolean {
    return Boolean(params.selected && !params.hasEndContent);
}
