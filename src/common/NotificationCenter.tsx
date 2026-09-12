import { useEffect, useRef } from "react";
import "react-notifications/lib/notifications.css";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
    dismissNotification,
    type AppNotification,
} from "../features/common/commonSlice";

const defaultTimeout = 5000;

const NotificationItem = ({ notification }: { notification: AppNotification }) => {
    const dispatch = useAppDispatch();

    return (
        <div
            className={`notification notification-${notification.type}`}
            role="alert"
        >
            <button
                type="button"
                className="notification-close"
                aria-label="Close notification"
                onClick={() => dispatch(dismissNotification(notification.id))}
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    border: 0,
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: "1rem",
                }}
            >
                x
            </button>
            {notification.title && <div className="title">{notification.title}</div>}
            <div>{notification.message}</div>
        </div>
    );
};

const NotificationCenter = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.common.notifications);
    const displayedNotificationIds = useRef(new Set<string>());

    useEffect(() => {
        notifications.forEach((notification) => {
            if (displayedNotificationIds.current.has(notification.id)) {
                return;
            }

            displayedNotificationIds.current.add(notification.id);
            const timeout = notification.timeout ?? defaultTimeout;
            window.setTimeout(() => {
                dispatch(dismissNotification(notification.id));
                displayedNotificationIds.current.delete(notification.id);
            }, timeout);
        });
    }, [dispatch, notifications]);

    return (
        <div className="notification-container" aria-live="polite">
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

export default NotificationCenter;