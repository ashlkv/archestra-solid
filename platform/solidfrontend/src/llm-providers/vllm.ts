/**
 * vLLM uses an OpenAI-compatible API.
 */
import OpenAiChatCompletionInteraction from "./openai";

class VllmChatCompletionInteraction extends OpenAiChatCompletionInteraction {}

export default VllmChatCompletionInteraction;
