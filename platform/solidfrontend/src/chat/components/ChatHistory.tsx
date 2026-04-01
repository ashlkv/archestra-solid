import { useSearchParams } from "@solidjs/router";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { ChevronDown, ChevronRight, Ellipsis, Loader2, Pencil, Trash2 } from "@/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/primitives/DropdownMenu";
import { useConversations, useDeleteConversation, useUpdateConversation } from "@/chat/chat.query";
import { getConversationDisplayTitle } from "@/chat/chat-utils";
import type { ConversationListItem } from "@/types";
import styles from "./ChatHistory.module.css";

const VISIBLE_COUNT = 10;
const MAX_TITLE_LENGTH = 30;

export function ChatHistory(
    props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: conversations, query } = useConversations(undefined as undefined);
    const { submit: deleteConversation } = useDeleteConversation();
    const { submit: updateConversation } = useUpdateConversation();

    const [showAll, setShowAll] = createSignal(false, { name: "showAll" });
    const [editingId, setEditingId] = createSignal<string | undefined>(undefined, { name: "editingId" });
    const [editingTitle, setEditingTitle] = createSignal("", { name: "editingTitle" });

    const currentConversationId = () => searchParams.conversation as string | undefined;

    const allChats = () => conversations() ?? [];
    const visibleChats = () => (showAll() ? allChats() : allChats().slice(0, VISIBLE_COUNT));
    const hiddenCount = () => Math.max(0, allChats().length - VISIBLE_COUNT);

    const onSelectConversation = (id: string) => {
        setSearchParams({ conversation: id });
    };

    const onStartEdit = (conversation: ConversationListItem) => {
        const title = getConversationDisplayTitle(conversation.title, undefined);
        setEditingId(conversation.id);
        setEditingTitle(title);
    };

    const onSaveEdit = (id: string) => {
        const title = editingTitle().trim();
        setEditingId(undefined);
        setEditingTitle("");
        if (!title) return;
        updateConversation({ id, title });
    };

    const onCancelEdit = () => {
        setEditingId(undefined);
        setEditingTitle("");
    };

    const onDelete = (id: string) => {
        deleteConversation(id);
        if (currentConversationId() === id) {
            setSearchParams({ conversation: undefined });
        }
    };

    return (
        <div class={`${styles["chat-history"]} ${local.class ?? ""}`} data-label="Chat history" {...rest}>
            <Show when={query.pending}>
                <div class={styles.status}>
                    <Loader2 size={12} class={styles.spinning} />
                    <span>Loading chats...</span>
                </div>
            </Show>

            <Show when={!query.pending && allChats().length === 0}>
                <div class={styles.status}>
                    <span>No chats yet</span>
                </div>
            </Show>

            <Show when={allChats().length > 0}>
                <For each={visibleChats()}>
                    {(conversation) => (
                        <ChatHistoryItem
                            conversation={conversation}
                            isActive={currentConversationId() === conversation.id}
                            isEditing={editingId() === conversation.id}
                            editingTitle={editingTitle()}
                            onSelect={() => onSelectConversation(conversation.id)}
                            onStartEdit={() => onStartEdit(conversation)}
                            onSaveEdit={() => onSaveEdit(conversation.id)}
                            onCancelEdit={onCancelEdit}
                            onEditingTitleChange={setEditingTitle}
                            onDelete={() => onDelete(conversation.id)}
                        />
                    )}
                </For>

                <Show when={hiddenCount() > 0}>
                    <button class={styles["show-more"]} onClick={() => setShowAll(!showAll())}>
                        <Show when={showAll()}>
                            <ChevronDown size={12} />
                            <span>Show less</span>
                        </Show>
                        <Show when={!showAll()}>
                            <ChevronRight size={12} />
                            <span>Show {hiddenCount()} more</span>
                        </Show>
                    </button>
                </Show>
            </Show>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function ChatHistoryItem(props: {
    conversation: ConversationListItem;
    isActive: boolean;
    isEditing: boolean;
    editingTitle: string;
    onSelect: () => void;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onEditingTitleChange: (title: string) => void;
    onDelete: () => void;
}): JSX.Element {
    const displayTitle = () => {
        const title = getConversationDisplayTitle(props.conversation.title, undefined);
        return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}...` : title;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") props.onSaveEdit();
        if (event.key === "Escape") props.onCancelEdit();
    };

    return (
        <div
            class={`${styles.item} ${props.isActive ? styles.active : ""}`}
            data-label={`Chat: ${props.conversation.id}`}
        >
            <Show when={props.isEditing}>
                <input
                    class={styles["edit-input"]}
                    value={props.editingTitle}
                    onInput={(event) => props.onEditingTitleChange(event.currentTarget.value)}
                    onBlur={() => props.onSaveEdit()}
                    onKeyDown={onKeyDown}
                    ref={(el) => {
                        queueMicrotask(() => {
                            el.focus();
                            el.select();
                        });
                    }}
                />
            </Show>

            <Show when={!props.isEditing}>
                <button class={styles["item-button"]} onClick={props.onSelect}>
                    <span class={styles["item-title"]}>{displayTitle()}</span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button class={styles["menu-trigger"]}>
                            <Ellipsis size={14} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={props.onStartEdit}>
                            <Pencil size={14} />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={props.onDelete}>
                            <Trash2 size={14} />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Show>
        </div>
    );
}
