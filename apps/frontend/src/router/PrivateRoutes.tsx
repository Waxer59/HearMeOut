import { Navigate } from 'react-router-dom';
import { useAccountStore } from '../store/account';

interface Props {
  children: React.ReactNode;
}

export const PrivateRoutes: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
};
