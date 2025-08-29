import { useState } from "react";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";
import "../style/Sidebar.css";

interface SidebarProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ onNavigate, activeRoute, onLogout, isCollapsed, onToggle }: SidebarProps) {
  const [isComitesOpen, setIsComitesOpen] = useState(false);
  const [wasCollapsedBeforeComites, setWasCollapsedBeforeComites] = useState(false);

  const toggleComites = () => {
    if (isCollapsed) {
      // Si está colapsado, expandir el sidebar y abrir comités
      setWasCollapsedBeforeComites(true); // Marcar que estaba colapsado
      onToggle(); // Expandir sidebar
      setIsComitesOpen(true); // Abrir submenú de comités
    } else {
      // Si está expandido, usar submenú normal
      setWasCollapsedBeforeComites(false);
      setIsComitesOpen(!isComitesOpen);
    }
  };

  const handleNavigation = (route: string) => {
    onNavigate(route);
    // Solo cerrar submenú si no es una opción de comités
    if (!route.startsWith("comites")) {
      setIsComitesOpen(false);
    }
    // Si el sidebar se expandió temporalmente para mostrar comités, colapsarlo de vuelta
    if (wasCollapsedBeforeComites && !route.startsWith("comites")) {
      onToggle(); // Colapsar de vuelta
      setWasCollapsedBeforeComites(false);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header con Logo PRM como Toggle Button */}
      <div className="sidebar-header">
        <div className="sidebar-logo-container" onClick={onToggle}>
          <img 
            src="/prm.png" 
            alt="PRM Logo" 
            className="sidebar-logo"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <div 
          className={`nav-item member-item ${activeRoute === "dashboard" ? "active" : ""}`}
          onClick={() => handleNavigation("dashboard")}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <div className="nav-icon">👤</div>
          <span className="nav-text">Miembro</span>
        </div>

        {/* Comités - Desplegable */}
        <div className={`nav-item comites-item ${(activeRoute === "comites-mi-comite" || activeRoute === "comites-todos") ? "active" : ""}`}>
          <div 
            className="nav-header"
            onClick={toggleComites}
            title={isCollapsed ? "Comités" : ""}
          >
            <div className="nav-icon comites-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Mesa */}
                <rect x="3" y="12" width="18" height="2.5" rx="1" fill="#D4A574"/>
                {/* Persona 1 - Arriba */}
                <circle cx="12" cy="7" r="2.5" fill="#FFB6C1"/>
                <rect x="9.5" y="9.5" width="5" height="3.5" rx="2" fill="#87CEEB"/>
                {/* Persona 2 - Izquierda */}
                <circle cx="5" cy="12" r="2.5" fill="#FFB6C1"/>
                <rect x="3" y="14.5" width="4" height="3.5" rx="2" fill="#87CEEB"/>
                {/* Persona 3 - Derecha */}
                <circle cx="19" cy="12" r="2.5" fill="#FFB6C1"/>
                <rect x="17" y="14.5" width="4" height="3.5" rx="2" fill="#87CEEB"/>
                {/* Persona 4 - Abajo (amarilla) */}
                <circle cx="12" cy="17" r="2.5" fill="#FFB6C1"/>
                <rect x="9.5" y="19.5" width="5" height="3.5" rx="2" fill="#FFD700"/>
              </svg>
            </div>
            <span className="nav-text">Comités</span>
            {!isCollapsed && (
              <div className={`dropdown-arrow ${isComitesOpen ? "open" : ""}`}>
                {isComitesOpen ? <TbArrowUp /> : <TbArrowDown />}
              </div>
            )}
          </div>
          
          {/* Submenú desplegable */}
          {isComitesOpen && !isCollapsed && (
            <div className="submenu">
              <div 
                className={`submenu-item ${activeRoute === "comites-mi-comite" ? "active" : ""}`}
                onClick={() => handleNavigation("comites-mi-comite")}
              >
                <div className="submenu-icon">👥</div>
                <span>Mi Comité</span>
              </div>
              <div 
                className={`submenu-item ${activeRoute === "comites-todos" ? "active" : ""}`}
                onClick={() => handleNavigation("comites-todos")}
              >
                <div className="submenu-icon">📋</div>
                <span>Todos los Comités</span>
              </div>
            </div>
          )}
        </div>

        {/* Cerrar Sesión */}
        <div className="nav-item logout-item" onClick={onLogout} title={isCollapsed ? "Cerrar Sesión" : ""}>
          <div className="nav-icon logout-icon">🚪</div>
          <span className="nav-text">Cerrar Sesión</span>
        </div>
      </nav>
    </div>
  );
} 