interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="flex flex-col gap-5 mt-48 w-[90%] max-w-[400px] mx-auto bg-secondary p-9 rounded-xl shadow-lg">
      {children}
    </div>
  );
}
