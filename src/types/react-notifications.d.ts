declare module "react-notifications" {
  import type { ComponentType } from "react";

  type NotificationMethod = (
    message: string,
    title?: string,
    timeout?: number,
    onClick?: () => void,
    priority?: boolean,
  ) => void;

  export const NotificationManager: Record<
    "success" | "error" | "warning" | "info",
    NotificationMethod
  >;

  export const NotificationContainer: ComponentType;
}
