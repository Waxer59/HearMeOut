interface Props {
  date: Date;
}

export const DateDivider: React.FC<Props> = ({ date }) => {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-b border-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <div className="bg-primary px-4">{date.toDateString()}</div>
      </div>
    </div>
  );
};
