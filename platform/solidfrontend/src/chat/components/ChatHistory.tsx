import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { useConversations, useDeleteConversation, useUpdateConversation } from "@/chat/chat.query";
import { getConversationDisplayTitle } from "@/chat/chat-utils";
import { ChevronDown, ChevronRight, Ellipsis, Loader2, Pencil, Trash2 } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/primitives/DropdownMenu";
import type { ConversationListItem } from "@/types";
import styles from "./ChatHistory.module.css";

const VISIBLE_COUNT = 10;
const MAX_TITLE_LENGTH = 30;

export function ChatHistory(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    const navigate = useNavigate();
    const location = useLocation();
    const { data: conversations, query } = useConversations(undefined as undefined);
    const { submit: deleteConversation } = useDeleteConversation();
    const { submit: updateConversation } = useUpdateConversation();

    const [showAll, setShowAll] = createSignal(false, { name: "showAll" });
    const [editingId, setEditingId] = createSignal<string | undefined>(undefined, { name: "editingId" });
    const [editingTitle, setEditingTitle] = createSignal("", { name: "editingTitle" });

    const currentChatId = () => {
        const match = location.pathname.match(/^\/chat\/(.+)/);
        return match?.[1];
    };

    const allChats = () => conversations() ?? [];
    const visibleChats = () => (showAll() ? allChats() : allChats().slice(0, VISIBLE_COUNT));
    const hiddenCount = () => Math.max(0, allChats().length - VISIBLE_COUNT);

    const onSelectChat = (id: string) => {
        navigate(`/chat/${id}`);
    };

    const onStartEdit = (chat: ConversationListItem) => {
        const title = getConversationDisplayTitle(chat.title, undefined);
        setEditingId(chat.id);
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
        if (currentChatId() === id) {
            navigate("/chat");
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
                    {(chat) => (
                        <ChatHistoryItem
                            chat={chat}
                            isActive={currentChatId() === chat.id}
                            isEditing={editingId() === chat.id}
                            editingTitle={editingTitle()}
                            onSelect={() => onSelectChat(chat.id)}
                            onStartEdit={() => onStartEdit(chat)}
                            onSaveEdit={() => onSaveEdit(chat.id)}
                            onCancelEdit={onCancelEdit}
                            onEditingTitleChange={setEditingTitle}
                            onDelete={() => onDelete(chat.id)}
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
    chat: ConversationListItem;
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
        const title = getConversationDisplayTitle(props.chat.title, undefined);
        return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}...` : title;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") props.onSaveEdit();
        if (event.key === "Escape") props.onCancelEdit();
    };

    return (
        <div class={`${styles.item} ${props.isActive ? styles.active : ""}`} data-label={`Chat: ${props.chat.id}`}>
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
