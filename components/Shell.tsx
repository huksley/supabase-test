import React, { forwardRef, useImperativeHandle } from "react";

export interface ShellRef {
  showError: (desc?: string) => void;
  showMessage: (desc?: string) => void;
}

export const Shell = forwardRef<
  ShellRef,
  {
    message?: string;
    children?: React.ReactNode;
    className?: string;
  }
>(({ message: initialMessage, children, className }, ref) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [message, setMessage] = React.useState<string | undefined>(initialMessage);
  const [close, setClose] = React.useState<boolean>(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        showError: (desc?: string) => {
          setClose(true)
          setError(desc);
          setTimeout(() => {
            setError(undefined);
            setClose(false);
          }, 3000)
        },
        showMessage: (desc?: string) => {
          setClose(true)
          setMessage(desc);
          setTimeout(() => {
            setMessage(undefined);
            setClose(false);
          }, 3000)
        },
      };
    },
    []
  );

  return (
    <div className="relative flex grow min-w-screen min-h-full items-center justify-center">
      {(error || message) && (
        <div className="absolute top-0 left-0 right-0 flex grow items-center justify-center">
          <div className="flex gap-2 items-center bg-slate-500 p-4 rounded mt-4">
            {error && <span className="text-2xl text-red-500">{error}</span>}
            {message && <div className="text-2xl">{message}</div>}

            {close && <button
              onClick={() => {
                setError(undefined);
                setMessage(undefined);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>}
          </div>
        </div>
      )}

      <div className="flex grow flex-col justify-center items-center md:max-w-[40%] sm:mx-4 md:mx-0">
        {className ? <div className={className}>{children}</div> : children}
      </div>
    </div>
  );
});
