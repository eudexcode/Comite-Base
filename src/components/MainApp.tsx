import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Dashboard } from "./Dashboard";
import { MiComite } from "./MiComite";
import { TodosLosComites } from "./TodosLosComites";
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
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(initialUser);

  // Usar el usuario inicial pasado como prop (solo si cambia)
  useEffect(() => {
    
    if (initialUser && (!loggedUser || loggedUser.cedula !== initialUser.cedula)) {
      console.log("MainApp - Actualizando loggedUser con:", initialUser);
      setLoggedUser(initialUser);
    }
  }, [initialUser, loggedUser]);

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
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


  const renderContent = () => {
    
    switch (activeRoute) {
      case "dashboard":
        return <Dashboard userCedula={loggedUser?.cedula} />;
      case "comites-mi-comite":
        return <MiComite comiteId={loggedUser?.comite_id} />;
      case "comites-todos":
        return <TodosLosComites />;
      default:
        return <Dashboard userCedula={loggedUser?.cedula} />;
    }
  };

  if (!isLoggedIn) {
    return null; // Esto debería redirigir al login
  }

  return (
    <div className="main-app">
      <Navbar 
        onNavigate={handleNavigation}
        activeRoute={activeRoute}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
} 