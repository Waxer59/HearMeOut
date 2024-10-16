import { Navigate } from 'react-router-dom';
import { useAccountStore } from '@store/account';

interface Props {
  children: JSX.Element;
}

export const PublicRoutes: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
