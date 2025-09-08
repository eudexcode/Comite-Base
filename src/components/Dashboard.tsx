import { useEffect, useState } from "react";
import { appSettings } from "../settings/appsettings";
import type { IMember } from "../interfaces/IMember";
import "../style/Dashboard.css";

interface DashboardProps {
  userCedula?: string;
}

export function Dashboard({ userCedula }: DashboardProps) {
  const [userInfo, setUserInfo] = useState<IMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<IMember | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  console.log("Dashboard - userCedula recibida:", userCedula);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log("Dashboard - fetchUserInfo iniciado con cédula:", userCedula);

      if (!userCedula) {
        console.error("Dashboard - ERROR: No se proporcionó userCedula");
        setError("No se proporcionó la cédula del usuario");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Dashboard - Haciendo API call para cédula:", userCedula);

        const response = await fetch(
          `${appSettings.apiUrl}/Members/byCedula/${userCedula}`
        );

        console.log("Dashboard - Respuesta de API:", response.status);

        if (response.ok) {
          const memberData: IMember = await response.json();
          console.log(
            "Dashboard - Información del usuario obtenida:",
            memberData
          );
          setUserInfo(memberData);
          setEditedUser(memberData);
        } else {
          console.error(
            "Dashboard - Error al obtener información del usuario:",
            response.status
          );
          setError("No se pudo obtener la información del usuario");
        }
      } catch (error) {
        console.error("Dashboard - Error de conexión:", error);
        setError("Error de conexión al obtener información del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userCedula]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Si estaba editando, cancelar cambios
      setEditedUser(userInfo);
    }
    setIsEditing(!isEditing);
  };

  const hasChanges = (): boolean => {
    if (!userInfo || !editedUser) return false;
    
    // Comparar campos editables
    return (
      userInfo.cedula !== editedUser.cedula ||
      userInfo.email !== editedUser.email ||
      userInfo.telefono !== editedUser.telefono ||
      userInfo.direccion !== editedUser.direccion ||
      userInfo.sector !== editedUser.sector
    );
  };

  const handleSaveChanges = async () => {
    if (!editedUser) return;

    // Verificar si hay cambios reales
    if (!hasChanges()) {
      console.log("Dashboard - No hay cambios detectados, simulando guardado");
      setIsEditing(false);
      return;
    }

    try {
      console.log("Dashboard - Cambios detectados, enviando petición API");
      
      const response = await fetch(
        `${appSettings.apiUrl}/Members/${editedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (response.ok) {
        setUserInfo(editedUser);
        setIsEditing(false);
        setShowSuccessNotification(true);
        
        // Ocultar notificación después de 3 segundos
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 3000);
        
        console.log("Dashboard - Perfil actualizado exitosamente");
      } else {
        console.error("Dashboard - Error al actualizar perfil");
      }
    } catch (error) {
      console.error("Dashboard - Error de conexión al actualizar:", error);
    }
  };

  const handleInputChange = (
    field: keyof IMember,
    value: string | number | boolean
  ) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        {/* Skeleton del Dashboard usando Tailwind */}
        <div className="animate-wave">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="w-[300px] h-8 bg-gray-200 rounded-lg mx-auto mb-2"></div>
            <div className="w-[200px] h-4 bg-gray-200 rounded-md mx-auto"></div>
          </div>

          {/* User info card skeleton */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-md flex flex-col lg:flex-row justify-between items-start gap-5">
            <div className="flex items-start gap-6 mt-2.5">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex flex-col gap-3">
                <div className="w-[200px] h-6 bg-gray-200 rounded-md"></div>
                <div className="w-[100px] h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="mt-0 pt-4">
              <div className="w-40 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* User fields card skeleton */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="w-20 h-3.5 bg-gray-200 rounded"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
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

          {/* Recent activity skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-[180px] h-5 bg-gray-200 rounded-md mb-5"></div>
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-[200px] h-3.5 bg-gray-200 rounded"></div>
                    <div className="w-[250px] h-[13px] bg-gray-200 rounded"></div>
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
      <div className="dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error al cargar información</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="dashboard">
        {/* Skeleton para cuando no hay datos del usuario */}
        <div className="animate-wave">
          {/* Header skeleton */}
          <div className="text-center mb-[200px]">
            <div className="w-[300px] h-8 bg-gray-200 rounded-lg mx-auto mb-2"></div>
            <div className="w-[200px] h-4 bg-gray-200 rounded-md mx-auto"></div>
          </div>

          {/* User info card skeleton */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-md flex justify-between items-start">
            <div className="flex items-start gap-6 mt-2.5">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex flex-col gap-3">
                <div className="w-[200px] h-6 bg-gray-200 rounded-md"></div>
                <div className="w-[100px] h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="mt-0 pt-4">
              <div className="w-40 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* User fields card skeleton */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
            <div className="grid grid-cols-3 gap-5">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="w-20 h-3.5 bg-gray-200 rounded"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-4 gap-5 mb-6">
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

          {/* Recent activity skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-[180px] h-5 bg-gray-200 rounded-md mb-5"></div>
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-[200px] h-3.5 bg-gray-200 rounded"></div>
                    <div className="w-[250px] h-[13px] bg-gray-200 rounded"></div>
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

  return (
    <div className="dashboard">
      {/* Notificación de éxito */}
      {showSuccessNotification && (
        <div className="success-notification">
          <div className="notification-content">
            <div className="notification-icon">✅</div>
            <div className="notification-text">
              <h3>¡Perfil Actualizado Exitosamente!</h3>
              <p>Los datos del miembro han sido actualizados correctamente en la base de datos.</p>
              <span className="notification-detail">Los cambios se han aplicado y guardado de forma permanente.</span>
            </div>
          </div>
          <div className="notification-progress"></div>
        </div>
      )}

      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <h1>Bienvenido, {userInfo.nombre}!</h1>
        <p>Panel de control principal</p>
      </div>

      {/* Información del usuario */}
      <div className="user-info-card">
        <div className="user-info-left">
          <div className="user-avatar">
            <span>
              {userInfo.nombre.charAt(0)}
              {userInfo.apellido?.charAt(0) || ""}
            </span>
          </div>
          <div className="user-details">
            <h3>
              {userInfo.nombre} {userInfo.apellido}
            </h3>
            <p className="user-role">
              {userInfo.rol_id === 1 ? "Miembro" : "Administrador"}
            </p>
          </div>
        </div>

        <div className="user-info-right">
          <button
            className={`edit-profile-btn ${isEditing ? "editing" : ""}`}
            onClick={isEditing ? handleSaveChanges : handleEditToggle}
          >
            <span className="edit-icon">{isEditing ? "💾" : "✏️"}</span>
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </button>
          {isEditing && (
            <button className="cancel-edit-btn mr-12" onClick={handleEditToggle}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Campos editables del usuario */}
      <div className="user-fields-card">
        <div className="user-fields-grid">
          <div className="field-item">
            <label>Cédula:</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser?.cedula || ""}
                onChange={(e) => handleInputChange("cedula", e.target.value)}
                className="editable-input"
              />
            ) : (
              <span className="field-value">{userInfo.cedula}</span>
            )}
          </div>

          <div className="field-item">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="editable-input"
              />
            ) : (
              <span className="field-value">{userInfo.email}</span>
            )}
          </div>

          <div className="field-item">
            <label>Teléfono:</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser?.telefono || ""}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                className="editable-input"
              />
            ) : (
              <span className="field-value">{userInfo.telefono}</span>
            )}
          </div>

          <div className="field-item">
            <label>Dirección:</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser?.direccion || ""}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                className="editable-input"
              />
            ) : (
              <span className="field-value">{userInfo.direccion}</span>
            )}
          </div>

          <div className="field-item">
            <label>Sector:</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser?.sector || ""}
                onChange={(e) => handleInputChange("sector", e.target.value)}
                className="editable-input"
              />
            ) : (
              <span className="field-value">{userInfo.sector}</span>
            )}
          </div>

          <div className="field-item">
            <label>Fecha de Ingreso:</label>
            <span className="field-value">
              {new Date(userInfo.fecha_ingreso).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Miembros</h3>
            <p className="stat-number">156</p>
            <span className="stat-change positive">+12 este mes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Comités Activos</h3>
            <p className="stat-number">8</p>
            <span className="stat-change">Sin cambios</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Eventos Próximos</h3>
            <p className="stat-number">3</p>
            <span className="stat-change positive">+2 esta semana</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Actividades Completadas</h3>
            <p className="stat-number">24</p>
            <span className="stat-change positive">+5 este mes</span>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p>
                <strong>Nuevo miembro registrado</strong>
              </p>
              <span>Arturo Montes se unió al Comité Central</span>
              <small>Hace 2 horas</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p>
                <strong>Reunión programada</strong>
              </p>
              <span>Reunión mensual del Comité Central</span>
              <small>Mañana a las 10:00 AM</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <p>
                <strong>Meta alcanzada</strong>
              </p>
              <span>Se completó el 75% de las actividades del mes</span>
              <small>Hace 1 día</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
