import { useState } from "react";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";
import "../style/Navbar.css";

interface NavbarProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
  onLogout: () => void;
}

export function Navbar({ onNavigate, activeRoute, onLogout }: NavbarProps) {
  const [isComitesOpen, setIsComitesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleComites = () => {
    setIsComitesOpen(!isComitesOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (route: string) => {
    onNavigate(route);
    // Cerrar el dropdown siempre que se seleccione una opción
    setIsComitesOpen(false);
    // Cerrar el menú móvil después de navegar
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo y título */}
      <div className="navbar-brand">
        <img 
          src="/prm.png" 
          alt="PRM Logo" 
          className="navbar-logo"
        />
        <span className="navbar-title">PRM</span>
      </div>

      {/* Menú de navegación - Desktop */}
      <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Dashboard */}
        <div 
          className={`navbar-item member-header ${activeRoute === "dashboard" ? "active" : ""}`}
          onClick={() => handleNavigation("dashboard")}
        >
          <div className="navbar-icon">👤</div>
          <span className="navbar-text">Miembro</span>
        </div>

        {/* Comités - Acordeón */}
        <div className="navbar-accordion">
          <div 
            className={`navbar-item accordion-header ${(activeRoute === "comites-mi-comite" || activeRoute === "comites-todos") ? "active" : ""}`}
            onClick={toggleComites}
          >
            <div className="navbar-icon comites-icon">
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
            <span className="navbar-text">Comités</span>
            <div className={`accordion-arrow ${isComitesOpen ? "open" : ""}`}>
              {isComitesOpen ? <TbArrowUp /> : <TbArrowDown />}
            </div>
          </div>
          
          {/* Contenido del acordeón */}
          <div className={`accordion-content ${isComitesOpen ? "open" : ""}`}>
            <div 
              className={`navbar-item accordion-item ${activeRoute === "comites-mi-comite" ? "active" : ""}`}
              onClick={() => handleNavigation("comites-mi-comite")}
            >
              <div className="navbar-icon">👥</div>
              <span className="navbar-text son">Mi Comité</span>
            </div>
            <div 
              className={`navbar-item accordion-item ${activeRoute === "comites-todos" ? "active" : ""}`}
              onClick={() => handleNavigation("comites-todos")}
            >
              <div className="navbar-icon">📋</div>
              <span className="navbar-text son">Todos</span>
            </div>
          </div>
        </div>

        {/* Cerrar Sesión */}
        <div className="navbar-item logout-item" onClick={onLogout}>
          <div className="navbar-icon logout-icon">🚪</div>
          <span className="navbar-text">Cerrar Sesión</span>
        </div>
      </div>

      {/* Menú hamburguesa para móvil */}
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Overlay para cerrar el menú móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}
    </nav>
  );
}
