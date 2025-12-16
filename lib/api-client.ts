import api from "./api";

// Auth
export const authApi = {
  githubLogin: () => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"
    }/api/${process.env.NEXT_PUBLIC_API_VERSION || "v1"}/auth/github`;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// Repositories
export const reposApi = {
  list: async () => {
    const response = await api.get("/repos/list");
    return response.data;
  },
  getConnected: async () => {
    const response = await api.get("/repos");
    return response.data;
  },
  connect: async (data: { repoId: number; owner: string; name: string }) => {
    const response = await api.post("/repos/connect", data);
    return response.data;
  },
  disconnect: async (repoId: string) => {
    const response = await api.delete(`/repos/${repoId}`);
    return response.data;
  },
  updateSettings: async (repoId: string, settings: any) => {
    const response = await api.patch(`/repos/${repoId}/settings`, { settings });
    return response.data;
  },
};

// Credits
export const creditsApi = {
  getBalance: async () => {
    const response = await api.get("/credits");
    return response.data;
  },
  add: async (amount: number) => {
    const response = await api.post("/credits/add", { amount });
    return response.data;
  },
};

// Analytics
export const analyticsApi = {
  get: async (days: number = 30) => {
    const response = await api.get(`/analytics?days=${days}`);
    return response.data;
  },
};

// Jobs
export const jobsApi = {
  list: async (params?: {
    repoId?: string;
    status?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.repoId) query.append("repoId", params.repoId);
    if (params?.status) query.append("status", params.status);
    if (params?.limit) query.append("limit", params.limit.toString());
    const response = await api.get(`/jobs?${query.toString()}`);
    return response.data;
  },
  get: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },
};

// AI Agent
export const aiApi = {
  chat: async (message: string, context?: any) => {
    const response = await api.post("/ai/chat", { message, context });
    return response.data;
  },
  chatStream: async (
    message: string,
    context: any,
    onEvent: (event: any) => void
  ) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/${
        process.env.NEXT_PUBLIC_API_VERSION || "v1"
      }/ai/chat/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message, context }),
      }
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.substring(6));
            onEvent(event);
          } catch (e) {
            console.error("Failed to parse event:", e);
          }
        }
      }
    }
  },
  confirm: async (data: {
    confirmationId: string;
    action: "accept" | "reject" | "modify";
    tool: string;
    args: any;
    modifiedArgs?: any;
  }) => {
    const response = await api.post("/ai/confirm", data);
    return response.data;
  },
  getCapabilities: async () => {
    const response = await api.get("/ai/capabilities");
    return response.data;
  },
};
