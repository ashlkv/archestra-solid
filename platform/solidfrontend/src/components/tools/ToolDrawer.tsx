import { A } from "@solidjs/router";
import { createSignal, For, type JSX, Show } from "solid-js";
import { Copy, ExternalLink, Eye, EyeOff } from "@/components/icons";
import { McpInstanceDetails } from "@/components/mcp-registry/McpInstanceDetails";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Tab, TabContent, TabList, Tabs } from "@/components/primitives/Tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/primitives/Collapsible";
import { fetchUserTokenValue } from "@/lib/user-token.query";
import { Drawer, DrawerContent } from "@/components/primitives/Drawer";
import { Markdown } from "@/components/primitives/Markdown";
import { Spinner } from "@/components/primitives/Spinner";
import { TimestampBadge } from "@/components/primitives/TimestampBadge";
import { useMcpServers } from "@/lib/mcp-registry.query";
import { useToolCallPolicies, useResultPolicies, useSaveCallPolicy, useSaveResultPolicy } from "@/lib/policy.query";
import { getCallPolicyActionFromPolicies, getResultPolicyActionFromPolicies } from "@/lib/policy.utils";
import type { CallPolicy, McpServer, ResultPolicyAction, ToolWithAssignments } from "@/types";
import { useTools } from "@/lib/tool.query";
import { CallPolicyToggle } from "./CallPolicyToggle";
import { OriginBadge } from "./OriginBadge";
import { ResultPolicySelect } from "./ResultPolicySelect";
import styles from "./ToolDrawer.module.css";

export function ToolDrawer(props: {
    toolId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    const { data: tools, query: toolsQuery } = useTools(() => ({ limit: 100, offset: 0 }));

    const tool = () => tools()?.find((t) => t.id === props.toolId);

    const toolSignature = () => {
        const t = tool();
        if (!t) return undefined;
        const params = t.parameters as
            | { properties?: Record<string, { type?: string }>; required?: string[] }
            | undefined;
        const entries = Object.entries(params?.properties ?? {});
        const name = shortName(t.name) ?? t.name;
        if (entries.length === 0) return `${name}()`;
        const args = entries.map(([n, s]) => `${n}: ${s?.type ?? "unknown"}`).join(", ");
        return `${name}(${args})`;
    };

    const headerContent = () => {
        const t = tool();
        if (!t) return undefined;
        return <ToolDrawerHeaderMeta tool={t} /> as JSX.Element;
    };

    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent
                title={toolSignature() ?? "Tool"}
                size="full"
                headerContent={headerContent()}
                noPadding
                titleClass={styles.drawerTitle}
            >
                <Show when={toolsQuery.pending && !tool()}>
                    <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                        <Spinner />
                    </div>
                </Show>
                <Show when={tool()}>
                    <ToolDrawerBody tool={tool()!} />
                </Show>
                <Show when={!toolsQuery.pending && !tool()}>
                    <p class={styles.fallback}>Tool not found.</p>
                </Show>
            </DrawerContent>
        </Drawer>
    );
}

function ToolDrawerHeaderMeta(props: { tool: ToolWithAssignments }): JSX.Element {
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();
    const [showCallForm, setShowCallForm] = createSignal(false);
    const [showResultForm, setShowResultForm] = createSignal(false);

    const defaultCallPolicy = () =>
        (callPolicies() ?? []).find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);

    const defaultResultPolicy = () =>
        (resultPolicies() ?? []).find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);

    const currentCallAction = () => getCallPolicyActionFromPolicies(props.tool.id, callPolicies());
    const currentResultAction = () => getResultPolicyActionFromPolicies(props.tool.id, resultPolicies());

    return (
        <div class={styles.headerMeta}>
            <div class={styles.headerTimestamps}>
                <OriginBadge toolName={props.tool.name} mcpServerName={props.tool.mcpServerName} />
                <TimestampBadge date={props.tool.createdAt} />
                <Show when={props.tool.updatedAt && props.tool.updatedAt !== props.tool.createdAt}>
                    <Badge variant="muted">Updated: {formatShortDate(props.tool.updatedAt)}</Badge>
                </Show>
                <A
                    href={`/logs/mcp-gateway?search=${encodeURIComponent(shortName(props.tool.name) ?? props.tool.name)}`}
                    class={styles.logsLink}
                >
                    <ExternalLink size={14} />
                    View in MCP gateway logs
                </A>
            </div>
            <div class={styles["header-policy-row"]}>
                <span class={styles["header-policy-label"]}>Call policy</span>
                <CallPolicyToggle
                    toolId={props.tool.id}
                    policyId={defaultCallPolicy()?.id}
                    value={currentCallAction()}
                    size="small"
                />
                <Show when={!showCallForm()}>
                    <Button size="small" onClick={() => setShowCallForm(true)}>
                        Add custom policy
                    </Button>
                </Show>
                <Show when={showCallForm()}>
                    {/*  TODO Use ToolCallPolicies here  */}
                </Show>
            </div>
            <div class={styles["header-policy-row"]}>
                <span class={styles["header-policy-label"]}>Result policy</span>
                <ResultPolicySelect
                    toolId={props.tool.id}
                    policyId={defaultResultPolicy()?.id}
                    value={currentResultAction()}
                    size="small"
                />
                <Show when={!showResultForm()}>
                    <Button size="small" onClick={() => setShowResultForm(true)}>
                        Add custom policy
                    </Button>
                </Show>
                <Show when={showResultForm()}>
                {/*  TODO Use ToolResultPolicies here  */}
                </Show>
            </div>
        </div>
    );
}



function ToolDrawerBody(props: { tool: ToolWithAssignments }): JSX.Element {
    const [selectedAgentId, setSelectedAgentId] = createSignal<string | undefined>(
        props.tool.assignments?.[0]?.agent?.id ?? undefined,
    );

    const params = () => {
        const schema = props.tool.parameters as
            | { properties?: Record<string, { type?: string; description?: string }>; required?: string[] }
            | undefined;
        return {
            properties: schema?.properties ?? {},
            required: new Set(schema?.required ?? []),
        };
    };

    const paramEntries = () => Object.entries(params().properties);

    const logsHref = () =>
        `/logs/mcp-gateway?search=${encodeURIComponent(shortName(props.tool.name) ?? props.tool.name)}`;

    return (
        <div class={styles.splitContainer}>
            {/* Left column – 50% */}
            <div class={styles.leftColumn}>
                <div class={styles.leftContent}>
                    <Show when={props.tool.description}>
                        <div class={styles.section}>
                            <span class={styles.sectionHeading}>Description</span>
                            <Markdown class={styles.description}>{props.tool.description ?? undefined}</Markdown>
                        </div>
                    </Show>

                    <Show when={paramEntries().length > 0}>
                        <div class={styles.section}>
                            <span class={styles.sectionHeading}>Parameters</span>
                            <div class={styles["param-list"]}>
                                <For each={paramEntries()}>
                                    {([name, schema]) => (
                                        <div class={styles["param-row"]}>
                                            <div class={styles["param-header"]}>
                                                <span class={styles["param-name"]}>{name}</span>
                                                <Show when={schema?.type}>
                                                    <span class={styles["param-type"]}>{schema.type}</span>
                                                </Show>
                                                <Show when={params().required.has(name)}>
                                                    <span class={styles["param-required"]}>required</span>
                                                </Show>
                                                <Show when={!params().required.has(name)}>
                                                    <span class={styles["param-optional"]}>optional</span>
                                                </Show>
                                            </div>
                                            <Show when={schema?.description}>
                                                <span class={styles["param-description"]}>{schema.description}</span>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </Show>

                </div>
            </div>

            {/* Right column – 50% */}
            <div class={styles.rightColumn}>
                <div class={styles.rightContent}>
                    <AgentTabs
                        tool={props.tool}
                        selectedAgentId={selectedAgentId()}
                        onSelectAgentId={setSelectedAgentId}
                    />
                    <CurlExample tool={props.tool} profileId={selectedAgentId()} />
                    <A href={logsHref()} class={styles.logsLink}>
                        <ExternalLink size={14} />
                        View in MCP gateway logs
                    </A>
                    <div class={styles.section}>
                        <span class={styles.sectionHeading}>Result policy help</span>
                        <ResultPolicyHelp />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CurlExample(props: { tool: ToolWithAssignments; profileId: string | undefined }): JSX.Element {
    const profileId = () => props.profileId ?? "<profile-id>";
    const [tokenExposed, setTokenExposed] = createSignal(false);
    const [tokenValue, setTokenValue] = createSignal<string | undefined>(undefined);
    const [loadingToken, setLoadingToken] = createSignal(false);

    const displayToken = () => tokenExposed() && tokenValue() ? tokenValue()! : "<token>";

    const argEntries = () => {
        const schema = props.tool.parameters as
            | { properties?: Record<string, { type?: string }> }
            | undefined;
        return Object.entries(schema?.properties ?? {});
    };

    const argumentsJson = (token?: string) => {
        const entries = argEntries();
        if (entries.length === 0) return "{}";
        const lines = entries.map(([name, schema]) => {
            const placeholder = schema?.type === "number" || schema?.type === "integer" ? "0" : `"<${name}>"`;
            return `        "${name}": ${placeholder}`;
        });
        return `{\n${lines.join(",\n")}\n      }`;
    };

    const gatewayBase = () => import.meta.env.VITE_ARCHESTRA_API_BASE_URL ?? "http://localhost:9000";

    const buildCurl = (token: string) =>
        `curl -X POST ${gatewayBase()}/v1/mcp/${profileId()} \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "${props.tool.name}",
      "arguments": ${argumentsJson()}
    }
  }'`;

    const curlText = () => buildCurl(displayToken());

    async function onExposeToken() {
        if (tokenExposed()) {
            setTokenExposed(false);
            setTokenValue(undefined);
            return;
        }
        setLoadingToken(true);
        const value = await fetchUserTokenValue();
        setTokenValue(value);
        setTokenExposed(true);
        setLoadingToken(false);
    }

    async function onCopyWithToken() {
        setLoadingToken(true);
        const value = tokenValue() ?? await fetchUserTokenValue();
        setTokenValue(value);
        setLoadingToken(false);
        if (value) {
            await navigator.clipboard.writeText(buildCurl(value));
        }
    }

    return (
        <div class={styles["curl-block"]}>
            <div class={styles["curl-header"]}>
                <Button size="small" onClick={onExposeToken} disabled={loadingToken()}>
                    <Show when={tokenExposed()}>
                        <EyeOff size={14} />
                    </Show>
                    <Show when={!tokenExposed()}>
                        <Eye size={14} />
                    </Show>
                    {tokenExposed() ? "Hide token" : "Expose token"}
                </Button>
                <Button size="small" onClick={onCopyWithToken} disabled={loadingToken()}>
                    <Copy size={14} />
                    Copy with exposed token
                </Button>
            </div>
            <pre class={styles["curl-pre"]}>
                <CurlLine>
                    <CurlKeyword>curl</CurlKeyword>{" "}
                    <CurlFlag>-X POST</CurlFlag>{" "}
                    <CurlUrl>{gatewayBase()}/v1/mcp/{profileId()}</CurlUrl>{" "}
                    <CurlContinue>\</CurlContinue>
                </CurlLine>
                <CurlLine>
                    {"  "}<CurlFlag>-H</CurlFlag>{" "}
                    <CurlString>"Authorization: Bearer <Show when={tokenExposed()}><CurlToken>{tokenValue()!}</CurlToken></Show><Show when={!tokenExposed()}><CurlPlaceholder>&lt;token&gt;</CurlPlaceholder></Show>"</CurlString>{" "}
                    <CurlContinue>\</CurlContinue>
                </CurlLine>
                <CurlLine>
                    {"  "}<CurlFlag>-H</CurlFlag>{" "}
                    <CurlString>"Content-Type: application/json"</CurlString>{" "}
                    <CurlContinue>\</CurlContinue>
                </CurlLine>
                <CurlLine>
                    {"  "}<CurlFlag>-H</CurlFlag>{" "}
                    <CurlString>"Accept: application/json, text/event-stream"</CurlString>{" "}
                    <CurlContinue>\</CurlContinue>
                </CurlLine>
                <CurlLine>
                    {"  "}<CurlFlag>-d</CurlFlag>{" "}
                    <CurlString>'{"{"}</CurlString>
                </CurlLine>
                <CurlLine>{"    "}<CurlKey>"jsonrpc"</CurlKey>{": "}<CurlString>"2.0"</CurlString>{","}</CurlLine>
                <CurlLine>{"    "}<CurlKey>"id"</CurlKey>{": "}<CurlNumber>1</CurlNumber>{","}</CurlLine>
                <CurlLine>{"    "}<CurlKey>"method"</CurlKey>{": "}<CurlString>"tools/call"</CurlString>{","}</CurlLine>
                <CurlLine>{"    "}<CurlKey>"params"</CurlKey>{": {"}</CurlLine>
                <CurlLine>{"      "}<CurlKey>"name"</CurlKey>{": "}<CurlString>"{props.tool.name}"</CurlString>{","}</CurlLine>
                <CurlLine>{"      "}<CurlKey>"arguments"</CurlKey>{": {"}</CurlLine>
                <For each={argEntries()}>
                    {([name, schema], index) => {
                        const isLast = () => index() === argEntries().length - 1;
                        const isNumber = schema?.type === "number" || schema?.type === "integer";
                        return (
                            <CurlLine>
                                {"        "}
                                <CurlKey>"{name}"</CurlKey>
                                {": "}
                                {isNumber
                                    ? <CurlNumber>0</CurlNumber>
                                    : <CurlString>"<CurlPlaceholder>&lt;{name}&gt;</CurlPlaceholder>"</CurlString>
                                }
                                {isLast() ? "" : ","}
                            </CurlLine>
                        );
                    }}
                </For>
                <CurlLine>{"      }"}</CurlLine>
                <CurlLine>{"    }"}</CurlLine>
                <CurlLine><CurlString>  {"}'"}  </CurlString></CurlLine>
            </pre>
        </div>
    );
}

function CurlLine(props: { children: JSX.Element }): JSX.Element {
    return <div class={styles["curl-line"]}>{props.children}</div>;
}
function CurlKeyword(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-keyword"]}>{props.children}</span>;
}
function CurlFlag(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-flag"]}>{props.children}</span>;
}
function CurlUrl(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-url"]}>{props.children}</span>;
}
function CurlString(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-string"]}>{props.children}</span>;
}
function CurlKey(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-key"]}>{props.children}</span>;
}
function CurlNumber(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-number"]}>{props.children}</span>;
}
function CurlPlaceholder(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-placeholder"]}>{props.children}</span>;
}
function CurlContinue(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-continue"]}>{props.children}</span>;
}
function CurlToken(props: { children: JSX.Element }): JSX.Element {
    return <span class={styles["curl-token"]}>{props.children}</span>;
}

function AgentTabs(props: {
    tool: ToolWithAssignments;
    selectedAgentId: string | undefined;
    onSelectAgentId: (agentId: string) => void;
}): JSX.Element {
    const { data: mcpServers } = useMcpServers();
    const assignments = () => props.tool.assignments ?? [];
    const isMcpTool = () => !!props.tool.mcpServerCatalogId;

    const instances = (): McpServer[] => {
        const catalogId = props.tool.mcpServerCatalogId;
        if (!catalogId) return [];
        return (mcpServers() ?? []).filter((s) => s.catalogId === catalogId);
    };

    return (
        <Show when={assignments().length > 0}>
            <Tabs
                value={props.selectedAgentId}
                onChange={props.onSelectAgentId}
                orientation="horizontal"
            >
                <TabList>
                    <For each={assignments()}>
                        {(assignment) => (
                            <Tab value={assignment.agent.id}>
                                <AgentBadge agentId={assignment.agent.id}>
                                    {assignment.agent.name}
                                </AgentBadge>
                            </Tab>
                        )}
                    </For>
                </TabList>

                <For each={assignments()}>
                    {(assignment) => (
                        <TabContent value={assignment.agent.id}>
                            <div class={styles["tab-credentials"]}>
                                <Show when={isMcpTool()}>
                                    <Show when={instances().length === 0}>
                                        <span class={styles.emptyCredentials}>No instances installed.</span>
                                    </Show>
                                    <For each={instances()}>
                                        {(instance) => <McpInstanceDetails instance={instance} />}
                                    </For>
                                </Show>

                                <Show when={!isMcpTool()}>
                                    <Show when={assignment.credentialOwnerEmail}>
                                        <span class={styles.installDetail}>{assignment.credentialOwnerEmail}</span>
                                    </Show>
                                    <Show when={assignment.useDynamicTeamCredential}>
                                        <span class={styles.installDetail}>Resolve at call time</span>
                                    </Show>
                                    <Show when={assignment.executionOwnerEmail && !assignment.credentialOwnerEmail}>
                                        <span class={styles.installDetail}>{assignment.executionOwnerEmail}</span>
                                    </Show>
                                    <Show
                                        when={
                                            !assignment.credentialOwnerEmail &&
                                            !assignment.useDynamicTeamCredential &&
                                            !assignment.executionOwnerEmail &&
                                            (assignment.credentialSourceMcpServerId || assignment.executionSourceMcpServerId)
                                        }
                                    >
                                        <span class={styles.installDetail}>Owner outside your team</span>
                                    </Show>
                                </Show>
                            </div>
                        </TabContent>
                    )}
                </For>
            </Tabs>
        </Show>
    );
}

function ResultPolicyHelp(): JSX.Element {
    return (
        <div class={styles.helpContent}>
            <p>
                Tool results impact agent decisions and actions. Result policies let you mark tool results as "trusted"
                or "untrusted" to prevent agents from acting on untrusted data.
            </p>
            <Collapsible>
                <CollapsibleTrigger>📖 Attribute path syntax cheat sheet</CollapsibleTrigger>
                <CollapsibleContent>
                    <div class={styles["help-body"]}>
                        <p class={styles["help-intro"]}>
                            Attribute paths use{" "}
                            <a
                                href="https://lodash.com/docs/4.17.15#get"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                lodash get syntax
                            </a>{" "}
                            to target specific fields in tool responses. You can use <code>*</code> as a wildcard to
                            match all items in an array.
                        </p>

                        <div class={styles["help-example"]}>
                            <h4>Example 1: Simple nested object</h4>
                            <p>Tool response from a weather API:</p>
                            <pre class={styles["help-pre"]}>{`{
  "location": "San Francisco",
  "current": {
    "temperature": 72,
    "conditions": "Sunny"
  }
}`}</pre>
                            <p>Attribute paths:</p>
                            <ul>
                                <li><code>location</code> → "San Francisco"</li>
                                <li><code>current.temperature</code> → 72</li>
                                <li><code>current.conditions</code> → "Sunny"</li>
                            </ul>
                        </div>

                        <div class={styles["help-example"]}>
                            <h4>Example 2: Array with wildcard (*)</h4>
                            <p>Tool response from an email API:</p>
                            <pre class={styles["help-pre"]}>{`{
  "emails": [
    { "from": "alice@company.com", "body": "Notes..." },
    { "from": "external@example.com", "body": "Malicious..." }
  ]
}`}</pre>
                            <p>Attribute paths:</p>
                            <ul>
                                <li><code>emails[*].from</code> → matches all "from" fields</li>
                                <li><code>emails[0].from</code> → "alice@company.com"</li>
                                <li><code>emails[*].body</code> → matches all "body" fields</li>
                            </ul>
                            <p class={styles["help-note"]}>
                                Use case: block emails from external domains or mark internal emails as trusted.
                            </p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

function shortName(name: string | undefined): string | undefined {
    if (!name) return undefined;
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
