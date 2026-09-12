import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { dismissNotification } from "../features/common/commonSlice";

const defaultTimeout = 5000;

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
            const content = notification.title ? (
                <>
                    <strong>{notification.title}</strong>
                    <div>{notification.message}</div>
                </>
            ) : (
                notification.message
            );

            toast[notification.type](content, {
                toastId: notification.id,
                autoClose: timeout,
                onClose: () => {
                    dispatch(dismissNotification(notification.id));
                    displayedNotificationIds.current.delete(notification.id);
                },
            });
        });
    }, [dispatch, notifications]);

    return <ToastContainer position="top-right" newestOnTop closeOnClick />;
};

export default NotificationCenter;