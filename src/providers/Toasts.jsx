import "./Toasts.scss";

import { createContext, useContext, useState, useEffect, useRef } from "react";

import { Notification, NotificationStack } from "@unioncredit/ui";

const ToastsContext = createContext({});

export const useToasts = () => useContext(ToastsContext);

const AUTO_CLEAR_MS = 3000;

export default function Toasts({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  const addToast = ({ content, link, variant, title, id }, autoClear = true) => {
    setToasts((x) => [...x, { id, content, link, variant, title }]);

    if (autoClear) {
      const timerId = setTimeout(() => {
        closeToast(id);
      }, AUTO_CLEAR_MS);
      timers.current.push(timerId);
    }

    return id;
  };

  const closeToast = (id) => {
    setToasts((x) => x.filter((toast) => toast.id !== id));
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
        {toasts.map(({ id, link, title, variant, content }) => (
          <Notification
            key={id}
            link={link}
            title={title}
            variant={variant}
            content={content}
            onClose={() => closeToast(id)}
          />
        ))}
      </NotificationStack>
    </ToastsContext.Provider>
  );
}
