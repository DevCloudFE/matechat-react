import type { Emitter } from "nanoevents";
import type { AvatarProps } from "../bubble";

export interface BaseEvent<T extends string> {
  id: string;
  type: T;
  payload?: unknown;
  timestamp?: number;
}

export interface InputEvent extends BaseEvent<"input"> {
  payload: {
    prompt: string;
  };
}
export interface MessageEvent extends BaseEvent<"message"> {
  payload: MessageParam;
}
export interface ErrorEvent extends BaseEvent<"error"> {
  payload: {
    error: string;
  };
}
export interface ChunkEvent extends BaseEvent<"chunk"> {
  payload: {
    chunk: string;
  };
}
export interface FinishEvent extends BaseEvent<"finish"> {
  payload: {
    message: string;
  };
}

export type EventTypes =
  | InputEvent
  | MessageEvent
  | ErrorEvent
  | ChunkEvent
  | FinishEvent;

export type EventHandler<K extends EventTypes["type"]> = (
  event: Extract<EventTypes, BaseEvent<K>>,
) => void;
export type Events = {
  [E in EventTypes["type"]]: EventHandler<E>;
};

export interface MessageParam {
  id: string;
  role: "user" | "assistant" | "system" | "developer";
  name?: string;
  content: string;
  avatar?: string | AvatarProps;
  align?: "left" | "center" | "right";
}

export type Awaitable<T> = T | Promise<T>;
export type Nullable<T> = T | null | undefined;

/**
 * Backend interface for chatbot.
 * @example
 * ```ts
 * import { Backend } from "matechat";
 * import { type Emitter, createNanoEvents } from "nanoevents";
 *
 * class MyBackend implements Backend {
 *   name = "my-backend";
 *   constructor() {
 *     this.emitter = createNanoEvents<Events>();
 *   }
 * }
 * 
 * input(prompt: string, config?: unknown): void {
 *   // Handle input logic here
 * }
 * 
 * on<K extends EventTypes["type"]>(
 *   type: K,
 *   handler: Events[K],
 * ): () => void {
 *   return this.emitter.on(type, handler);
 * }
 }
 */
export interface Backend {
  readonly name: string;
  emitter: Emitter<Events>;
  input(prompt: string, config?: unknown): Awaitable<void>;
  on<K extends EventTypes["type"]>(
    type: K,
    handler: EventHandler<K>,
  ): () => void;
}
