import { useEffect, useState } from "react";
import { appSettings } from "../settings/appsettings";
import type { IComite } from "../interfaces/IComite";
import type { IMember } from "../interfaces/IMember";
import "../style/MiComite.css";

interface MiComiteProps {
  comiteId?: number;
}

export function MiComite({ comiteId }: MiComiteProps) {
  const [comiteInfo, setComiteInfo] = useState<IComite | null>(null);
  const [secretarioInfo, setSecretarioInfo] = useState<IMember | null>(null);
  const [miembros, setMiembros] = useState<IMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("MiComite - comiteId recibido:", comiteId);

  useEffect(() => {
    const fetchComiteInfo = async () => {
      console.log("MiComite - fetchComiteInfo iniciado con comiteId:", comiteId);

      if (!comiteId) {
        console.error("MiComite - ERROR: No se proporcionó comiteId");
        setError("No se pudo determinar a qué comité perteneces. Por favor, cierra sesión y vuelve a iniciar sesión para actualizar tu información.");
        setIsLoading(false);
        return;
      }

      try {
        console.log("MiComite - Haciendo API call para comiteId:", comiteId);

        // Obtener información del comité
        const comiteResponse = await fetch(
          `${appSettings.apiUrl}/Comites/${comiteId}`
        );

        console.log("MiComite - Respuesta de API comité:", comiteResponse.status);

        if (comiteResponse.ok) {
          const comiteData: IComite = await comiteResponse.json();
          console.log("MiComite - Información del comité obtenida:", comiteData);
          setComiteInfo(comiteData);

          // Obtener información del secretario
          if (comiteData.secretario) {
            const secretarioResponse = await fetch(
              `${appSettings.apiUrl}/Members/${comiteData.secretario}`
            );

            if (secretarioResponse.ok) {
              const secretarioData: IMember = await secretarioResponse.json();
              console.log("MiComite - Información del secretario obtenida:", secretarioData);
              setSecretarioInfo(secretarioData);
            }
          }

          // Obtener miembros del comité
          const miembrosResponse = await fetch(
            `${appSettings.apiUrl}/Members/byComite/${comiteId}`
          );

          if (miembrosResponse.ok) {
            const miembrosData: IMember[] = await miembrosResponse.json();
            console.log("MiComite - Miembros del comité obtenidos:", miembrosData);
            setMiembros(miembrosData);
          }

        } else {
          console.error(
            "MiComite - Error al obtener información del comité:",
            comiteResponse.status
          );
          setError("No se pudo obtener la información del comité");
        }
      } catch (error) {
        console.error("MiComite - Error de conexión:", error);
        setError("Error de conexión al obtener información del comité");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComiteInfo();
  }, [comiteId]);

  if (isLoading) {
    return (
      <div className="mi-comite">
        {/* Skeleton del MiComite usando Tailwind */}
        <div className="animate-wave">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="w-[400px] h-10 bg-gray-200 rounded-lg mx-auto mb-2"></div>
            <div className="w-[300px] h-5 bg-gray-200 rounded-md mx-auto"></div>
          </div>

          {/* Comité info card skeleton */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-md">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="w-[300px] h-8 bg-gray-200 rounded-md"></div>
                <div className="w-[200px] h-6 bg-gray-200 rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full h-5 bg-gray-200 rounded"></div>
                  <div className="w-full h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secretario card skeleton */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
            <div className="w-[200px] h-6 bg-gray-200 rounded-md mb-4"></div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-[180px] h-5 bg-gray-200 rounded"></div>
                <div className="w-[120px] h-4 bg-gray-200 rounded"></div>
                <div className="w-[100px] h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-[120px] h-4 bg-gray-200 rounded"></div>
                  <div className="w-[60px] h-7 bg-gray-200 rounded-md"></div>
                  <div className="w-[100px] h-3.5 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Miembros list skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-[200px] h-6 bg-gray-200 rounded-md mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-[140px] h-4 bg-gray-200 rounded"></div>
                    <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mi-comite">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error al cargar información del comité</h2>
          <p>{error}</p>
          {error.includes("No se pudo determinar a qué comité perteneces") ? (
            <button 
              onClick={() => {
                localStorage.removeItem('loggedUser');
                window.location.href = "/";
              }}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "16px"
              }}
            >
              Cerrar Sesión y Volver al Login
            </button>
          ) : (
            <button onClick={() => window.location.reload()}>Reintentar</button>
          )}
        </div>
      </div>
    );
  }

  if (!comiteInfo) {
    return (
      <div className="mi-comite">
        <div className="no-data-container">
          <div className="no-data-icon">🏢</div>
          <h2>No se encontró información del comité</h2>
          <p>No se pudo cargar la información del comité al que perteneces.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mi-comite">
      {/* Header del Comité */}
      <div className="comite-header">
        <h1>Mi Comité</h1>
        <p>Información detallada del comité al que perteneces</p>
      </div>

      {/* Información principal del comité */}
      <div className="comite-info-card">
        <div className="comite-info-left">
          <div className="comite-avatar">
            <span>{comiteInfo.nombre.charAt(0)}</span>
          </div>
          <div className="comite-details">
            <h3>{comiteInfo.nombre}</h3>
            <p className="comite-zone">Zona: {comiteInfo.zona}</p>
            <div className="comite-contact">
              <span>📧 {comiteInfo.email}</span>
              <span>📞 {comiteInfo.telefono}</span>
            </div>
          </div>
        </div>
        <div className="comite-info-right">
          <div className="comite-status">
            <span className={`status-badge ${comiteInfo.activo ? 'active' : 'inactive'}`}>
              {comiteInfo.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="comite-date">
            <span>Fundado: {new Date(comiteInfo.fecha_creacion).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Información del secretario */}
      {secretarioInfo && (
        <div className="secretario-card">
          <h2>Secretario del Comité</h2>
          <div className="secretario-info">
            <div className="secretario-avatar">
              <span>
                {secretarioInfo.nombre.charAt(0)}
                {secretarioInfo.apellido?.charAt(0) || ""}
              </span>
            </div>
            <div className="secretario-details">
              <h3>
                {secretarioInfo.nombre} {secretarioInfo.apellido}
              </h3>
              <p className="secretario-contact">
                📧 {secretarioInfo.email} | 📞 {secretarioInfo.telefono}
              </p>
              <p className="secretario-address">
                📍 {secretarioInfo.direccion}, {secretarioInfo.sector}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del comité */}
      <div className="comite-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Miembros</h3>
            <p className="stat-number">{miembros.length}</p>
            <span className="stat-change">Miembros registrados</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Estado del Comité</h3>
            <p className="stat-number">{comiteInfo.activo ? 'Activo' : 'Inactivo'}</p>
            <span className="stat-change">Operativo</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Fecha de Creación</h3>
            <p className="stat-number">{new Date(comiteInfo.fecha_creacion).getFullYear()}</p>
            <span className="stat-change">Año de fundación</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>Zona</h3>
            <p className="stat-number">{comiteInfo.zona}</p>
            <span className="stat-change">Ubicación</span>
          </div>
        </div>
      </div>

      {/* Lista de miembros */}
      <div className="miembros-section">
        <h2>Miembros del Comité ({miembros.length})</h2>
        <div className="miembros-grid">
          {miembros.map((miembro) => (
            <div key={miembro.id} className="miembro-card">
              <div className="miembro-avatar">
                <span>
                  {miembro.nombre.charAt(0)}
                  {miembro.apellido?.charAt(0) || ""}
                </span>
              </div>
              <div className="miembro-info">
                <h4>
                  {miembro.nombre} {miembro.apellido}
                </h4>
                <p className="miembro-role">
                  {miembro.rol_id === 1 ? "Miembro" : "Administrador"}
                </p>
                <p className="miembro-contact">
                  📧 {miembro.email}
                </p>
                <p className="miembro-sector">
                  📍 {miembro.sector}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="comite-additional-info">
        <h2>Información Adicional</h2>
        <div className="info-grid">
          <div className="info-item">
            <h4>Dirección del Comité</h4>
            <p>{comiteInfo.direccion}</p>
          </div>
          <div className="info-item">
            <h4>Fecha de Ingreso</h4>
            <p>{new Date(comiteInfo.fecha_creacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}