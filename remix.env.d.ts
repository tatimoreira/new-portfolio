/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

interface Document {
  startViewTransition?(callback: () => void | Promise<void>): {
    finished: Promise<void>;
  };
}
