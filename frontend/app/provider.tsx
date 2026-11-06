"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
  return (<ReduxProvider store={store}>{children}</ReduxProvider>);
};

export default Provider;
