import { Navigate } from 'react-router-dom';
import { useAccountStore } from '../../store/account';

interface Props {
  children: JSX.Element;
}

const PublicRoutes = ({ children }: Props) => {
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Navigate to={'/chat'} /> : children;
};

export default PublicRoutes;
