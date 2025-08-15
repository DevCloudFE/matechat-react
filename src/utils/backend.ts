import { createNanoEvents, type Emitter } from "nanoevents";
import OpenAI, { type ClientOptions } from "openai";
import type { Backend, Events, EventTypes, MessageParam } from "./types";
import { getRandomId } from "./utils";

/**
 * Configuration options for the `OpenAIBackend` class.
 */
export interface OpenAIBackendConfig extends ClientOptions {
  /**
   * The OpenAI model to use for chat completions.
   * @default "gpt-3.5-turbo"
   */
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Options for the input method of the `OpenAIBackend` class.
 */
export interface InputOptions {
  /**
   * Additional options for the input, such as system messages or user messages.
   * If not provided, a default user message will be used.
   * @default undefined
   */
  messages?: MessageParam[];
  /**
   * An AbortController instance that can be used to abort the input process.
   * @default undefined
   */
  signal?: AbortSignal;
  /**
   * Optional callbacks for handling input, chunk, error, and finish events.
   * These callbacks only apply to the `input` method and are not registered
   * globally on the backend.
   * @default undefined
   */
  callbacks?: {
    onInput?: (prompt: string) => void;
    onChunk?: (chunk: string) => void;
    onError?: (error: Error) => void;
    onFinish?: () => void;
  };
}

/**
 * A backend implementation that uses the OpenAI API for chat completions.
 */
export class OpenAIBackend implements Backend {
  /**
   * The name of the backend.
   */
  readonly name = "OpenAI";
  /**
   * The OpenAI client instance.
   */
  instance: OpenAI;
  /**
   * An event emitter for handling events.
   *
   * @remarks
   * Based on `nanoevents`, this emitter allows for subscribing to and emitting events.
   * It supports events such as "input", "message", "error", and "chunk".
   */
  emitter: Emitter<Events>;

  /**
   * Creates a new instance of the `OpenAIBackend` class.
   *
   * @param config - The configuration options for the backend.
   */
  constructor(public config: OpenAIBackendConfig) {
    this.instance = new OpenAI(config);
    this.emitter = createNanoEvents<Events>();
  }

  /**
   * Sends a user input prompt to the OpenAI API and emits events based on the response.
   *
   * @param prompt - The user input prompt to send.
   * @param options - Additional options for the input, such as messages.
   * @returns {Promise<void>} A promise that resolves when the input has been processed.
   */
  async input(prompt: string, options?: InputOptions): Promise<void> {
    this.emitter.emit("input", {
      id: getRandomId(16),
      type: "input",
      payload: { prompt },
    });
    options?.callbacks?.onInput?.(prompt);
    const { messages } = options || {};

    if (options?.signal?.aborted) return;

    try {
      const response = await this.instance.chat.completions.create(
        {
          model: this.config.model || "gpt-3.5-turbo",
          messages: messages
            ? [...messages, { role: "user", content: prompt }]
            : [{ role: "user", content: prompt }],
          ...this.config,
          stream: true,
          max_completion_tokens: this.config.maxTokens,
          response_format: { type: "text" },
        },
        {
          signal: options?.signal,
        },
      );
      for await (const chunk of response) {
        const chunkMessage = chunk.choices[0].delta.content || "";
        this.emitter.emit("chunk", {
          id: chunk.id,
          type: "chunk",
          payload: { chunk: chunkMessage },
        });
        options?.callbacks?.onChunk?.(chunkMessage);
        if (options?.signal?.aborted) return;
      }
    } catch (error) {
      this.emitter.emit("error", {
        id: getRandomId(16),
        type: "error",
        payload: { error: (error as Error).message },
      });
    }
    this.emitter.emit("finish", {
      id: getRandomId(16),
      type: "finish",
      payload: { message: prompt },
    });
    options?.callbacks?.onFinish?.();
  }

  /**
   * Subscribes to an event of a specific type and registers a handler for it.
   *
   * @param type - The type of the event to subscribe to.
   * @param handler - The handler function to call when the event is emitted.
   * @returns A function that can be called to unsubscribe from the event.
   */
  on<K extends EventTypes["type"]>(type: K, handler: Events[K]): () => void {
    return this.emitter.on(type, handler);
  }
}

/**
 * Creates a new instance of the `OpenAIBackend` class with the provided configuration.
 * @param config - The configuration options for the backend.
 * @returns A new instance of the `OpenAIBackend` class.
 * @example
 * const backend = createOpenAIBackend({
 *   apiKey: "<your-api-key>",
 *   model: "deepseek-chat",
 * });
 })
 */
export function createOpenAIBackend(config: OpenAIBackendConfig) {
  return new OpenAIBackend(config);
}
