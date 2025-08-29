import "../style/LoadingScreen.css";

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-logo">
          <img src="/prm.png" alt="PRM Logo" />
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <div className="loading-text">
          <h2>Cargando...</h2>
          <p>Verificando sesión</p>
        </div>
      </div>
    </div>
  );
} 