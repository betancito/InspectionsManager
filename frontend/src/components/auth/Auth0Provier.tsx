import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { setAuthUser, clearAuth } from '../../features/slicers/authSlice';

export const Auth0Provider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        dispatch(setAuthUser(user));
      } else {
        dispatch(clearAuth());
      }
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  return <>{children}</>;
};
