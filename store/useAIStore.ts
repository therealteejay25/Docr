import { create } from "zustand";
import { aiApi } from "@/lib/api-client";

export interface StreamEvent {
  type: string;
  data: any;
  timestamp: number;
}

interface AIState {
  message: string;
  status: "idle" | "thinking" | "executing" | "asking" | "completed" | "error";
  steps: Array<{
    step: number;
    description: string;
    status: "pending" | "in_progress" | "completed" | "failed";
    totalSteps?: number;
  }>;
  confirmation: any | null;
  actions: Array<{
    type: string;
    status: string;
    description: string;
    result?: any;
    error?: string;
  }>;
  isStreaming: boolean;
  sendMessage: (message: string, context?: any) => Promise<void>;
  handleConfirmation: (
    action: "accept" | "reject" | "modify",
    modifiedArgs?: any
  ) => Promise<void>;
  reset: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  message: "",
  status: "idle",
  steps: [],
  confirmation: null,
  actions: [],
  isStreaming: false,
  sendMessage: async (message, context) => {
    set({ isStreaming: true, status: "thinking", message: "", steps: [], actions: [], confirmation: null });

    await aiApi.chatStream(message, context || {}, (event: StreamEvent) => {
      switch (event.type) {
        case "status":
          set({ status: event.data.status, message: event.data.message });
          break;

        case "thinking":
          set({ status: "thinking", message: event.data.message });
          break;

        case "step":
          set((state) => {
            const steps = [...state.steps];
            const index = steps.findIndex((s) => s.step === event.data.step);
            if (index >= 0) {
              steps[index] = event.data;
            } else {
              steps.push(event.data);
            }
            return { steps, status: "executing" };
          });
          break;

        case "confirmation":
          set({
            confirmation: { ...event.data, id: Date.now().toString() },
            status: "asking",
          });
          break;

        case "action":
          set((state) => {
            const actions = [...state.actions];
            const index = actions.findIndex((a) => a.type === event.data.type);
            if (index >= 0) {
              actions[index] = event.data;
            } else {
              actions.push(event.data);
            }
            return { actions };
          });
          break;

        case "message":
          set({ message: event.data.message });
          break;

        case "result":
          set({
            message: event.data.message,
            actions: event.data.actions || [],
            steps: event.data.steps || [],
            status: "completed",
          });
          break;

        case "error":
          set({
            status: "error",
            message: event.data.message,
            isStreaming: false,
          });
          break;

        case "done":
          set({ isStreaming: false, status: "completed" });
          break;
      }
    });
  },
  handleConfirmation: async (action, modifiedArgs) => {
    const { confirmation } = get();
    if (!confirmation) return;

    try {
      await aiApi.confirm({
        confirmationId: confirmation.id,
        action,
        tool: confirmation.tool,
        args: confirmation.args,
        modifiedArgs,
      });

      set({ confirmation: null });
      if (action === "accept" || action === "modify") {
        set({ status: "executing" });
      } else {
        set({ status: "idle", message: "Action cancelled." });
      }
    } catch (error: any) {
      set({ status: "error", message: error.message });
    }
  },
  reset: () => {
    set({
      message: "",
      status: "idle",
      steps: [],
      confirmation: null,
      actions: [],
      isStreaming: false,
    });
  },
}));

