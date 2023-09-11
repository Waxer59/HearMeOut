import { Navigate } from 'react-router-dom';
import { useAccountStore } from '../../store/account';

interface Props {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: Props) => {
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoutes;
