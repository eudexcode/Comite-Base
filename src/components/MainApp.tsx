import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { MiComite } from "./MiComite";
import "../style/MainApp.css";

interface LoggedUser {
  cedula: string;
  nombre: string;
  comite_id: number;
}

interface MainAppProps {
  initialUser: LoggedUser;
}

export function MainApp({ initialUser }: MainAppProps) {
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(initialUser);

  // Detectar tamaño de pantalla y colapsar sidebar en móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Ejecutar al montar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Usar el usuario inicial pasado como prop (solo si cambia)
  useEffect(() => {
    
    if (initialUser && (!loggedUser || loggedUser.cedula !== initialUser.cedula)) {
      console.log("MainApp - Actualizando loggedUser con:", initialUser);
      setLoggedUser(initialUser);
    }
  }, [initialUser, loggedUser]);

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    
    // En móvil, colapsar sidebar después de navegar
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(true);
    }
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('loggedUser');
    
    // Limpiar estado
    setIsLoggedIn(false);
    setLoggedUser(null);
    
    // Redirigir al login
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    
    switch (activeRoute) {
      case "dashboard":
        return <Dashboard userCedula={loggedUser?.cedula} />;
      case "comites-mi-comite":
        return <MiComite comiteId={loggedUser?.comite_id} />;
      case "comites-todos":
        return (
          <div className="content-placeholder">
            <h1>Todos los Comités</h1>
            <p>Aquí se mostrará la lista de todos los comités disponibles.</p>
          </div>
        );
      default:
        return <Dashboard userCedula={loggedUser?.cedula} />;
    }
  };

  if (!isLoggedIn) {
    return null; // Esto debería redirigir al login
  }

  return (
    <div className="main-app">
      <Sidebar 
        onNavigate={handleNavigation}
        activeRoute={activeRoute}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <main className={`main-content ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {renderContent()}
      </main>
      
      {/* Overlay para móvil cuando sidebar está abierta */}
      {!isSidebarCollapsed && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarCollapsed(true)} />
      )}
    </div>
  );
} 