  import { createContext, useContext } from 'react';
  import { useAuth as useFirebaseAuth } from '../../firebase/hooks/useAuth';

  const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    const auth = useFirebaseAuth();

  if (auth.isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #4caf50',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <span style={{ fontSize: '1.2rem', color: '#4caf50', fontWeight: '500' }}>
          Loading...
        </span>
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
