import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

const iconslice = createSlice({
  name: "icon",
  initialState: {
    icon: "moon",
  },
  reducers: {
    iconMoon: (state) => {
      state.icon = "moon";
    },
    iconSun: (state) => {
      state.icon = "sun";
    },
  },
});

const store = configureStore({
  reducer: {
    icon: iconslice.reducer,
  },
});

const { iconMoon, iconSun } = iconslice.actions;

export function useStore() {
  const icon = useSelector((state) => state.icon.icon);
  const dispatch = useDispatch();
  return {
    icon,
    iconMoon: () => dispatch(iconMoon()),
    iconSun: () => dispatch(iconSun()),
  };
}

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
