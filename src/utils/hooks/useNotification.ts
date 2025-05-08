import { notifications } from "@mantine/notifications";

interface UseNotification {
  notifySuccess: (message: string, title?: string) => void;
  notifyError: (message: string, title?: string) => void;
  notifyInfo: (message: string, title?: string) => void;
}

const useNotification = (): UseNotification => {
  const notifySuccess = (message: string, title: string = "Success") => {
    notifications.show({
      title,
      message,
      color: "green",
      autoClose: 3000,
    });
  };

  const notifyError = (message: string, title: string = "Error") => {
    notifications.show({
      title,
      message,
      color: "red",
    });
  };

  const notifyInfo = (message: string, title: string = "Info") => {
    notifications.show({
      title,
      message,
      color: "blue",
    });
  };

  return { notifySuccess, notifyError, notifyInfo };
};

export default useNotification;
