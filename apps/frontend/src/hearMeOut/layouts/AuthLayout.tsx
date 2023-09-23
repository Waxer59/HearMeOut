import { Toaster } from 'sonner';

interface Props {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="pt-48">
        <div className="flex flex-col gap-5 w-[90%] max-w-[400px] mx-auto p-9 rounded-xl shadow-lg bg-secondary">
          {children}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
