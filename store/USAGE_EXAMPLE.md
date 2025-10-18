# Redux Toolkit Usage Guide

## Project Structure

```
store/
├── slices/
│   └── authSlice.ts          # Auth state slice
├── hooks.ts                   # Typed Redux hooks
├── store.ts                   # Store configuration
├── StoreProvider.tsx          # Provider component
└── USAGE_EXAMPLE.md          # This file
```

## How to Use Redux in Your Components

### 1. Reading State

```tsx
"use client";

import { useAppSelector } from "@/store/hooks";

export default function UserProfile() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### 2. Dispatching Actions

```tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/authSlice";

export default function LoginButton() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogin = () => {
    dispatch(setUser({
      id: "123",
      email: "user@example.com",
      name: "John Doe"
    }));
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <button onClick={isAuthenticated ? handleLogout : handleLogin}>
      {isAuthenticated ? "Logout" : "Login"}
    </button>
  );
}
```

## Creating New Slices

### Example: UI Slice for sidebar state

```typescript
// store/slices/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: "system",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
```

### Then add it to the store:

```typescript
// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice"; // Add this

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer, // Add this
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
```

## Async Operations with Redux Thunks

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ... regular reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});
```

## Best Practices

1. **Use typed hooks** (`useAppDispatch`, `useAppSelector`) instead of plain Redux hooks
2. **Keep slices focused** - One slice per feature domain
3. **Normalize state** - Avoid deeply nested data
4. **Use React Query for server state** - Redux for client/UI state only
5. **Don't put everything in Redux** - Use local state when appropriate

## What to Store in Redux vs React Query

### Redux (Client State):
- UI state (sidebar open/closed, modals)
- User session/auth state
- App-wide settings
- Form wizard progress

### React Query (Server State):
- Products, categories (already using)
- API data
- Cached server responses
