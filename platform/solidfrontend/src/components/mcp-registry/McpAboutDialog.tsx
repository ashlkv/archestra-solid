import { Show, For, type JSX } from "solid-js";
import type { archestraCatalogTypes } from "@shared";
import {
    Info,
    Users,
    Link,
    Globe,
    BookOpen,
    Github,
    Terminal,
    Code2,
    FileText,
    Settings,
    Calendar,
    Star,
    ExternalLink,
} from "@/components/icons";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Badge } from "../primitives/Badge";
import { Spinner } from "../primitives/Spinner";
import { useMcpServerDetails } from "@/lib/mcp-registry.query";
import styles from "./McpAboutDialog.module.css";

type Props = {
    serverName: string;
    onClose: () => void;
};

type Server = archestraCatalogTypes.ArchestraMcpServerManifest;

function Section(props: { title: string; icon: JSX.Element; children: JSX.Element }) {
    return (
        <div class={styles.section}>
            <h3 class={styles["section-title"]}>
                <span class={styles["section-title-icon"]}>{props.icon}</span>
                {props.title}
            </h3>
            <div class={styles["section-content"]}>{props.children}</div>
        </div>
    );
}

function Separator() {
    return <div class={styles.separator} data-label="Separator" />;
}

export function McpAboutDialog(props: Props): JSX.Element {
    const { data: server, query } = useMcpServerDetails(props.serverName);

    return (
        <Dialog open onOpenChange={(open) => { if (!open) props.onClose(); }}>
            <DialogContent title={server()?.display_name ?? server()?.name ?? "Server"} size="small">
                <Show when={query.pending}>
                    <div class={styles.loading}>
                        <Spinner />
                    </div>
                </Show>

                <Show when={!query.pending && server()}>
                    <div class={styles.container}>
                        <Show when={server()?.description}>
                            <p class={styles.description}>{server()!.description}</p>
                        </Show>

                        <Section title="Overview" icon={<Info size={20} />}>
                            <>
                                <Show when={server()?.long_description}>
                                    <p class={styles.description}>{server()!.long_description}</p>
                                </Show>
                                <div class={styles.badges}>
                                    <Show when={server()?.quality_score != null}>
                                        <Badge variant="muted">Quality: {Math.round(server()!.quality_score!)}</Badge>
                                    </Show>
                                    <Show when={server()?.category}>
                                        <Badge variant="muted">{server()!.category}</Badge>
                                    </Show>
                                    <Show when={server()?.programming_language}>
                                        <Badge variant="muted">{server()!.programming_language}</Badge>
                                    </Show>
                                    <Show when={server()?.license}>
                                        <Badge variant="muted">{server()!.license}</Badge>
                                    </Show>
                                </div>
                                <Show when={server()?.keywords && server()!.keywords!.length > 0}>
                                    <div class={styles.field}>
                                        <span class={styles["field-label"]}>Keywords:</span>
                                        <span class={styles["field-value"]}>{server()!.keywords!.join(", ")}</span>
                                    </div>
                                </Show>
                            </>
                        </Section>

                        <Show when={server()?.author}>
                            <Separator />
                            <Section title="Author" icon={<Users size={20} />}>
                                <>
                                    <div class={styles.field}>
                                        <span class={styles["field-label"]}>Name:</span>
                                        <span class={styles["field-value"]}>{server()!.author!.name}</span>
                                    </div>
                                    <Show when={server()!.author!.email}>
                                        <div class={styles.field}>
                                            <span class={styles["field-label"]}>Email:</span>
                                            <a href={`mailto:${server()!.author!.email}`} class={styles.link}>
                                                {server()!.author!.email}
                                            </a>
                                        </div>
                                    </Show>
                                    <Show when={server()!.author!.url}>
                                        <div class={styles.field}>
                                            <span class={styles["field-label"]}>URL:</span>
                                            <a href={server()!.author!.url} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                                {server()!.author!.url}
                                                <ExternalLink size={12} class={styles["link-icon"]} />
                                            </a>
                                        </div>
                                    </Show>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.homepage || server()?.documentation || server()?.support || server()?.github_info?.url}>
                            <Separator />
                            <Section title="Links" icon={<Link size={20} />}>
                                <>
                                    <Show when={server()?.homepage}>
                                        <a href={server()!.homepage} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                            <Globe size={16} class={styles["link-icon"]} />
                                            Homepage: {server()!.homepage}
                                        </a>
                                    </Show>
                                    <Show when={server()?.documentation}>
                                        <a href={server()!.documentation} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                            <BookOpen size={16} class={styles["link-icon"]} />
                                            Documentation: {server()!.documentation}
                                        </a>
                                    </Show>
                                    <Show when={server()?.support}>
                                        <a href={server()!.support} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                            <Info size={16} class={styles["link-icon"]} />
                                            Support: {server()!.support}
                                        </a>
                                    </Show>
                                    <Show when={server()?.github_info?.url}>
                                        <a href={server()!.github_info!.url} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                            <Github size={16} class={styles["link-icon"]} />
                                            GitHub: {server()!.github_info!.url}
                                        </a>
                                    </Show>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.server}>
                            <Separator />
                            <Section title="Server configuration" icon={<Terminal size={20} />}>
                                <>
                                    <div class={styles.field}>
                                        <span class={styles["field-label"]}>Type:</span>
                                        <Badge variant="muted">{server()!.server!.type}</Badge>
                                    </div>
                                    <Show when={server()!.server!.type === "local"}>
                                        <div class={styles.field}>
                                            <span class={styles["field-label"]}>Command:</span>
                                            <code class={styles.code}>{server()!.server!.command}</code>
                                        </div>
                                        <Show when={server()!.server!.args && server()!.server!.args!.length > 0}>
                                            <div class={styles.field}>
                                                <span class={styles["field-label"]}>Arguments:</span>
                                                <code class={styles.code}>{server()!.server!.args!.join(" ")}</code>
                                            </div>
                                        </Show>
                                        <Show when={server()!.server!.env && Object.keys(server()!.server!.env!).length > 0}>
                                            <div>
                                                <span class={styles["field-label"]}>Environment variables:</span>
                                                <div class={styles["env-vars"]}>
                                                    <For each={Object.entries(server()!.server!.env!)}>
                                                        {([key, value]) => (
                                                            <div class={styles["env-var"]}>
                                                                <span class={styles["env-var-key"]}>{key}</span>={value}
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </div>
                                        </Show>
                                    </Show>
                                    <Show when={server()!.server!.type === "remote"}>
                                        <div class={styles.field}>
                                            <span class={styles["field-label"]}>URL:</span>
                                            <a href={server()!.server!.url} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                                {server()!.server!.url}
                                            </a>
                                        </div>
                                        <Show when={server()!.server!.docs_url}>
                                            <div class={styles.field}>
                                                <span class={styles["field-label"]}>Docs URL:</span>
                                                <a href={server()!.server!.docs_url} target="_blank" rel="noopener noreferrer" class={styles.link}>
                                                    {server()!.server!.docs_url}
                                                </a>
                                            </div>
                                        </Show>
                                    </Show>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.tools && server()!.tools!.length > 0}>
                            <Separator />
                            <Section title={`Tools (${server()!.tools!.length})`} icon={<Code2 size={20} />}>
                                <>
                                    <For each={server()!.tools}>
                                        {(tool) => (
                                            <div class={styles["tool-card"]}>
                                                <div class={styles["tool-name"]}>{tool.name}</div>
                                                <Show when={tool.description}>
                                                    <div class={styles["tool-description"]}>{tool.description}</div>
                                                </Show>
                                            </div>
                                        )}
                                    </For>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.prompts && server()!.prompts!.length > 0}>
                            <Separator />
                            <Section title={`Prompts (${server()!.prompts!.length})`} icon={<FileText size={20} />}>
                                <>
                                    <For each={server()!.prompts}>
                                        {(prompt) => (
                                            <div class={styles["tool-card"]}>
                                                <div class={styles["tool-name"]}>{prompt.name}</div>
                                                <Show when={prompt.description}>
                                                    <div class={styles["tool-description"]}>{prompt.description}</div>
                                                </Show>
                                            </div>
                                        )}
                                    </For>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.user_config && Object.keys(server()!.user_config!).length > 0}>
                            <Separator />
                            <Section title="Configuration options" icon={<Settings size={20} />}>
                                <>
                                    <For each={Object.entries(server()!.user_config!)}>
                                        {([key, config]) => (
                                            <div class={styles["config-card"]}>
                                                <div class={styles["config-header"]}>
                                                    <div class={styles["config-name"]}>{key}</div>
                                                    <div class={styles["config-badges"]}>
                                                        <Badge variant="muted">{config.type}</Badge>
                                                        <Show when={config.required}>
                                                            <Badge variant="destructive">Required</Badge>
                                                        </Show>
                                                        <Show when={config.sensitive}>
                                                            <Badge variant="muted">Sensitive</Badge>
                                                        </Show>
                                                    </div>
                                                </div>
                                                <div class={styles["config-description"]}>{config.description}</div>
                                                <Show when={config.default !== undefined}>
                                                    <div class={styles["config-default"]}>Default: {String(config.default)}</div>
                                                </Show>
                                            </div>
                                        )}
                                    </For>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.github_info}>
                            <Separator />
                            <Section title="GitHub statistics" icon={<Github size={20} />}>
                                <div class={styles["github-stats"]}>
                                    <div class={styles["github-stat"]}>
                                        <Star size={16} class={styles["github-stat-icon"]} style={{ color: "#eab308" }} />
                                        <span class={styles["github-stat-label"]}>Stars:</span>
                                        <span class={styles["github-stat-value"]}>{server()!.github_info!.stars}</span>
                                    </div>
                                    <div class={styles["github-stat"]}>
                                        <Users size={16} class={styles["github-stat-icon"]} style={{ color: "#3b82f6" }} />
                                        <span class={styles["github-stat-label"]}>Contributors:</span>
                                        <span class={styles["github-stat-value"]}>{server()!.github_info!.contributors}</span>
                                    </div>
                                    <div class={styles["github-stat"]}>
                                        <span class={styles["github-stat-label"]}>Issues:</span>
                                        <span class={styles["github-stat-value"]}>{server()!.github_info!.issues}</span>
                                    </div>
                                    <div class={styles["github-stat"]}>
                                        <span class={styles["github-stat-label"]}>Releases:</span>
                                        <span class={styles["github-stat-value"]}>{server()!.github_info!.releases ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            </Section>
                        </Show>

                        <Show when={server()?.last_scraped_at}>
                            <Separator />
                            <Section title="Metadata" icon={<Calendar size={20} />}>
                                <>
                                    <div class={styles.field}>
                                        <span class={styles["field-label"]}>Last updated:</span>
                                        <span class={styles["field-value"]}>
                                            {new Date(server()!.last_scraped_at!).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Show when={server()?.programming_language}>
                                        <div class={styles.field}>
                                            <span class={styles["field-label"]}>Language:</span>
                                            <span class={styles["field-value"]}>{server()!.programming_language}</span>
                                        </div>
                                    </Show>
                                </>
                            </Section>
                        </Show>

                        <Show when={server()?.readme}>
                            <Separator />
                            <Section title="README" icon={<FileText size={20} />}>
                                <div class={styles["readme-container"]}>
                                    <pre style={{ "white-space": "pre-wrap", "word-break": "break-word" }}>
                                        {server()!.readme}
                                    </pre>
                                </div>
                            </Section>
                        </Show>
                    </div>
                </Show>
            </DialogContent>
        </Dialog>
    );
}
