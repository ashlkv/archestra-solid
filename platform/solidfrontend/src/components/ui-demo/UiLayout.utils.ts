export function filterUiNavItems(params: {
    items: Array<{ title: string; url: string }>;
    searchQuery: string;
}): Array<{ title: string; url: string }> {
    const normalizedQuery = params.searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
        return params.items;
    } else {
        return params.items.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
    }
}
