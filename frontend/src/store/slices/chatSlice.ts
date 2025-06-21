import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage } from "@/types/chatType";
import axiosInstance from "@/lib/axios-config";
import { apiLinks } from "@/lib/api-link";
import { AppDispatch, RootState } from "../store";

interface ChatState {
  messages: Record<string, ChatMessage[]>;
  status: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  error: Record<string, string | null>;
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: {},
  status: {},
  error: {},
  isTyping: false,
};

// Fetch messages
export const fetchMessages = createAsyncThunk<
  { projectId: string; data: ChatMessage[] },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("chat/fetchMessages", async (projectId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${apiLinks.chat.getHistory}/${projectId}`);
    return { projectId, data: response.data.messages as ChatMessage[] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch messages";
    return rejectWithValue(message);
  }
});

// Send message
export const sendMessage = createAsyncThunk<
  { projectId: string; message: ChatMessage },
  { projectId: string; message: ChatMessage },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("chat/sendMessage", async ({ projectId, message }, { dispatch, rejectWithValue }) => {
  try {
    await axiosInstance.post(`${apiLinks.chat.sendMessage}/${projectId}`, { question: message.content });
    return { projectId, message };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return rejectWithValue(message);
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTypingStatus: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    addBotMessage: (
      state,
      action: PayloadAction<{ projectId: string; message: ChatMessage }>
    ) => {
      const { projectId, message } = action.payload;

      // Initialize messages array for projectId if it doesn't exist
      state.messages[projectId] = state.messages[projectId] || [];
      state.messages[projectId].push(message);
    },
    clearChat: (state, action: PayloadAction<string>) => {
      const projectId = action.payload;
      state.messages[projectId] = [];
      state.status[projectId] = "idle";
      state.error[projectId] = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "loading";
        state.error[projectId] = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.messages[projectId] = data;
        state.status[projectId] = "succeeded";
        state.error[projectId] = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to fetch messages";
      })
      // Send message
      .addCase(sendMessage.pending, (state, action) => {
        const { projectId, message } = action.meta.arg;
        state.status[projectId] = "loading";
        state.messages[projectId] = state.messages[projectId] || [];
        state.messages[projectId].push(message);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { projectId } = action.payload;
        state.status[projectId] = "succeeded";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { projectId } = action.meta.arg;
        state.status[projectId] = "failed";
        state.error[projectId] = action.payload || "Failed to send message";
      });
  },
});

export const { setTypingStatus, clearChat,addBotMessage } = chatSlice.actions;

export default chatSlice.reducer;