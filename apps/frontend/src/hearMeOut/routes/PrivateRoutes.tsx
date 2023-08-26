interface Props {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: Props) => {
  return children;
};

export default PrivateRoutes;
