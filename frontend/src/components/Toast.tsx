interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return <div className="potof-toast">{message}</div>;
}
