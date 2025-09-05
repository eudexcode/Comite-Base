import { useEffect, useState } from "react";
import { appSettings } from "../settings/appsettings";
import type { IComite } from "../interfaces/IComite";
import type { IMember } from "../interfaces/IMember";
import "../style/TodosLosComites.css";

interface ComiteConMiembros extends IComite {
  cantidadMiembros: number;
}

export function TodosLosComites() {
  const [comites, setComites] = useState<ComiteConMiembros[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllComites = async () => {
      try {
        setIsLoading(true);
        
        // Obtener todos los comités
        const comitesResponse = await fetch(`${appSettings.apiUrl}/Comites`);
        
        if (!comitesResponse.ok) {
          throw new Error("Error al obtener los comités");
        }
        
        const comitesData: IComite[] = await comitesResponse.json();
        
        // Para cada comité, obtener la cantidad de miembros
        const comitesConMiembros = await Promise.all(
          comitesData.map(async (comite) => {
            try {
              const miembrosResponse = await fetch(
                `${appSettings.apiUrl}/Members/byComite/${comite.id}`
              );
              
              let cantidadMiembros = 0;
              if (miembrosResponse.ok) {
                const miembrosData: IMember[] = await miembrosResponse.json();
                cantidadMiembros = miembrosData.length;
              }
              
              return {
                ...comite,
                cantidadMiembros
              };
            } catch (error) {
              console.error(`Error al obtener miembros del comité ${comite.id}:`, error);
              return {
                ...comite,
                cantidadMiembros: 0
              };
            }
          })
        );
        
        setComites(comitesConMiembros);
      } catch (error) {
        console.error("Error al obtener comités:", error);
        setError("Error al cargar los comités");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllComites();
  }, []);

  if (isLoading) {
    return (
      <div className="todos-los-comites">
        {/* Skeleton responsive */}
        <div className="animate-wave">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="w-[400px] h-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="w-[350px] h-6 bg-gray-200 rounded-md mx-auto"></div>
          </div>

          {/* Control panel skeleton */}
          <div className="bg-white rounded-xl p-8 mb-8 shadow-md">
            <div className="flex justify-between items-center gap-6">
              <div className="w-[350px] h-14 bg-gray-200 rounded-lg"></div>
              <div className="flex gap-6">
                <div className="w-[140px] h-14 bg-gray-200 rounded-lg"></div>
                <div className="w-[180px] h-14 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Table header skeleton */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="grid grid-cols-5 gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Table rows skeleton */}
            <div className="divide-y divide-gray-200">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="px-8 py-6">
                  <div className="grid grid-cols-5 gap-6 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="w-[140px] h-5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-[100px] h-5 bg-gray-200 rounded"></div>
                    <div className="w-[90px] h-5 bg-gray-200 rounded"></div>
                    <div className="w-[90px] h-7 bg-gray-200 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    </div>
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
      <div className="todos-los-comites">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error al cargar los comités</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="todos-los-comites">
      {/* Header */}
      <div className="comites-header">
        <h1>Todos los Comités</h1>
        <p>Gestión y visualización de todos los comités registrados</p>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar comité..." 
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>
        
        <div className="actions-section">
          <button className="filters-btn">
            <span className="filter-icon">🔽</span>
            FILTROS
          </button>
          <button className="new-comite-btn">
            <span className="plus-icon">+</span>
            NUEVO COMITÉ
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="comites-table-container">
        <div className="comites-table">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-cell">Nombre</div>
            <div className="header-cell">Zona</div>
            <div className="header-cell">Cantidad de Miembros</div>
            <div className="header-cell">Estado</div>
            <div className="header-cell">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="table-body">
            {comites.map((comite) => (
              <div key={comite.id} className="table-row">
                <div className="table-cell comite-name" data-label="NOMBRE">
                  <div className="comite-icon">
                    <span>{comite.nombre.charAt(0)}</span>
                  </div>
                  <span className="comite-title">{comite.nombre}</span>
                </div>
                
                <div className="table-cell" data-label="ZONA">
                  <span className="comite-zone">{comite.zona}</span>
                </div>
                
                <div className="table-cell" data-label="CANTIDAD DE MIEMBROS">
                  <div className="members-count">
                    <span className="members-icon">👥</span>
                    <span className="members-number">{comite.cantidadMiembros}</span>
                    <span className="members-label">miembros</span>
                  </div>
                </div>
                
                <div className="table-cell" data-label="ESTADO">
                  <span className={`status-badge ${comite.activo ? 'active' : 'inactive'}`}>
                    {comite.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="table-cell" data-label="ACCIONES">
                  <div className="action-buttons">
                    <button className="action-btn edit-btn" title="Editar">
                      ✏️
                    </button>
                    <button className="action-btn delete-btn" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {comites.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>No hay comités registrados</h3>
          <p>No se encontraron comités en la base de datos.</p>
        </div>
      )}
    </div>
  );
}
