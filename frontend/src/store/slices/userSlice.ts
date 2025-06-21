import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
}

export interface UserState {
  token: string | null;
  profile: UserProfile | null;
}

const initialState: UserState = {
  token: null,
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.profile = null;

    },
  },
});

export const { setToken, logout, setProfile } = userSlice.actions;
export default userSlice.reducer;
