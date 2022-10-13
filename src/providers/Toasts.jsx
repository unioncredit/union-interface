import "./Toasts.scss";

import { createContext, useContext, useState, useEffect, useRef } from "react";

import { Label, Notification, NotificationStack } from "@unioncredit/ui";

const ToastsContext = createContext({});

export const useToasts = () => useContext(ToastsContext);

const AUTO_CLEAR_MS = 3000;

export default function Toasts({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  const addToast = ({ content, link, variant, title }, autoClear = true) => {
    const id = toasts.length;
    setToasts((x) => [...x, { id, content, link, variant, title }]);

    if (autoClear) {
      const timerId = setTimeout(() => {
        closeToast(id);
      }, AUTO_CLEAR_MS);
      timers.current.push(timerId);
    }

    return id;
  };

  const closeToast = (index) => {
    setToasts((x) => x.filter((_, i) => index !== i));
  };

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  return (
    <ToastsContext.Provider value={{ closeToast, addToast, toasts }}>
      {children}
      <NotificationStack className="Toasts">
        {toasts.map((toast) => (
          <Notification
            link={toast.link}
            title={toast.title}
            variant={toast.variant}
            onClose={() => closeToast(toast.id)}
          >
            <Label as="p" size="small">
              {toast.link ? (
                <a href={toast.link} target="_blank" rel="noreferrer">
                  {toast.content}
                </a>
              ) : (
                toast.content
              )}
            </Label>
          </Notification>
        ))}
      </NotificationStack>
    </ToastsContext.Provider>
  );
}
