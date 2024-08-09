import { Toaster } from 'sonner';

interface Props {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="mt-48 flex flex-col gap-5 w-[90%] max-w-[400px] mx-auto p-9 rounded-xl shadow-lg bg-secondary">
        {children}
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
