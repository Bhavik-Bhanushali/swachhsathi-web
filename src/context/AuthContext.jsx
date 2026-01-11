  import { createContext, useContext } from 'react';
  import { useAuth as useFirebaseAuth } from '../../firebase/hooks/useAuth';

  const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    const auth = useFirebaseAuth();

  if (auth.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#4caf50'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

  export const useAuth = () => useContext(AuthContext);
