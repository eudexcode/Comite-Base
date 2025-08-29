import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { appSettings } from "../settings/appsettings";
import type { IMember } from "../interfaces/IMember";
import type { IComite } from "../interfaces/IComite";
import type { IRol } from "../interfaces/IRol";
import { MainApp } from "./MainApp";
import { LoadingScreen } from "./LoadingScreen";
import "../style/AuthForm.css";

const initialMember: IMember = {
  id: 0,
    nombre: "",
  apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    direccion: "",
    sector: "",
  comite_id: 0,
  rol_id: 0,
    fecha_ingreso: new Date(),
  activo: true,
};

export function LoginAndRegister() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [member, setMember] = useState<IMember>(initialMember);
  const [comites, setComites] = useState<IComite[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ cedula: string; nombre: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar el componente
  useEffect(() => {
    const checkAuthAndLoading = async () => {
      console.log('Iniciando loading...');
      setIsLoading(true);
      
      // Simular un delay para mostrar el loading
      console.log('Esperando 10 segundos...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Delay completado');
      
      const savedUser = localStorage.getItem('loggedUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setLoggedUser(user);
          setIsAuthenticated(true);
          console.log('Usuario encontrado en localStorage');
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('loggedUser');
        }
      } else {
        console.log('No hay usuario en localStorage');
      }
      console.log('Finalizando loading...');
      setIsLoading(false);
    };
    
    checkAuthAndLoading();
  }, []);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const inputName = event.target.name;
    const rawValue = event.target.value;

    if (inputName === "cedula") {
      // Solo permitir números y formatear automáticamente
      const numbersOnly = rawValue.replace(/\D/g, "");
      if (numbersOnly.length <= 11) {
        const formatted = formatCedula(numbersOnly);
        setMember((prev) => ({ ...prev, [inputName]: formatted }));
      }
    } else {
      const inputValue =
        inputName === "comite_id" || inputName === "rol_id"
          ? Number(rawValue)
          : rawValue;
      setMember((prev) => ({ ...prev, [inputName]: inputValue }));
    }

    // Limpiar el error del campo cuando el usuario empiece a escribir
    if (errors[inputName]) {
      setErrors((prev) => ({ ...prev, [inputName]: "" }));
    }
  };

  const formatCedula = (numbers: string): string => {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 10)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 10)}-${numbers.slice(
      10
    )}`;
  };

  const formatTelefono = (numbers: string): string => {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)})${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
      6
    )}`;
  };

  const getCedulaNumbers = (): string => {
    return member.cedula.replace(/\D/g, "");
  };

  const getTelefonoNumbers = (): string => {
    return member.telefono.replace(/\D/g, "");
  };

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case "nombre":
        if (!value || String(value).trim().length === 0)
          return "El campo Nombre es obligatorio";
        if (String(value).trim().length < 2)
          return "El nombre debe tener al menos 3 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(String(value)))
          return "El nombre solo puede contener letras";
        break;
      case "apellido":
        if (!value || String(value).trim().length === 0)
          return "El campo Apellido es obligatorio";
        if (String(value).trim().length < 2)
          return "El apellido debe tener al menos 2 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(String(value)))
          return "El apellido solo puede contener letras";
        break;
      case "cedula": {
        if (!value || String(value).trim().length === 0)
          return "El campo Cédula es obligatorio";
        const cedulaNumbers = String(value).replace(/\D/g, "");
        if (cedulaNumbers.length !== 11)
          return "La cédula debe tener 11 dígitos";
        break;
      }
      case "telefono":
        if (!value || String(value).trim().length === 0)
          return "El campo Teléfono es obligatorio";
        if (String(value).trim().length < 10)
          return "El teléfono debe tener al menos 10 dígitos";
        if (!/^\d+$/.test(String(value).replace(/\D/g, "")))
          return "El teléfono solo puede contener números";
        break;
      case "email":
        if (!value || String(value).trim().length === 0)
          return "El campo Email es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
          return "Ingrese un email válido";
        break;
      case "sector":
        if (!value || String(value).trim().length === 0)
          return "El campo Sector es obligatorio";
        if (String(value).trim().length < 2)
          return "El sector debe tener al menos 2 caracteres";
        break;
      case "direccion":
        if (!value || String(value).trim().length === 0)
          return "El campo Dirección es obligatorio";
        if (String(value).trim().length < 5)
          return "La dirección debe tener al menos 5 caracteres";
        break;
      case "comite_id":
        if (!value || value === 0) return "Debe seleccionar un comité";
        break;
    }
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(member).forEach((key) => {
      if (
        key !== "id" &&
        key !== "fecha_ingreso" &&
        key !== "activo" &&
        key !== "rol_id"
      ) {
        const value = member[key as keyof IMember];
        if (typeof value === "string" || typeof value === "number") {
          const error = validateField(key, value);
          if (error) {
            newErrors[key] = error;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Errores de validación:", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const memberData = {
        ...member,
        cedula: getCedulaNumbers(), // Solo números para el backend
        telefono: getTelefonoNumbers(), // Solo números para el backend
        fecha_ingreso: new Date().toISOString(),
        activo: true, // activo = 1
        rol_id: 1, // rol_id = 1 (miembro)
        comite_id: member.comite_id, // ID del comité seleccionado
      };

      const response = await fetch(`${appSettings.apiUrl}/Members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Miembro registrado exitosamente:", result);

        // Mostrar notificación de éxito
        setShowSuccess(true);

        // Limpiar formulario
        setMember(initialMember);
        setErrors({});

        // Después de 2 segundos, cambiar a login y ocultar notificación
        setTimeout(() => {
          setShowSuccess(false);
          setIsSignUp(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Error en el servidor:", errorData);
        alert(
          `Error al registrar: ${errorData.message || "Error desconocido"}`
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCedulaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const numbersOnly = rawValue.replace(/\D/g, "");

    if (numbersOnly.length <= 11) {
      const formatted = formatCedula(numbersOnly);
      setMember((prev) => ({ ...prev, cedula: formatted }));
    }

    // Limpiar el error de cédula cuando el usuario empiece a escribir
    if (errors.cedula) {
      setErrors((prev) => ({ ...prev, cedula: "" }));
    }

    // Limpiar error de login cuando el usuario empiece a escribir
    if (loginError) {
      setLoginError(false);
    }
  };

  const handleTelefonoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const numbersOnly = rawValue.replace(/\D/g, "");

    if (numbersOnly.length <= 10) {
      const formatted = formatTelefono(numbersOnly);
      setMember((prev) => ({ ...prev, telefono: formatted }));
    }

    // Limpiar el error de teléfono cuando el usuario empiece a escribir
    if (errors.telefono) {
      setErrors((prev) => ({ ...prev, telefono: "" }));
    }
  };

    const handleLogin = async () => {
    // Limpiar error anterior
    setLoginError(false);
    setShowErrorModal(false);
    
    // Validar que la cédula no esté vacía
    if (!member.cedula || member.cedula.trim().length === 0) {
      setLoginError(true);
      return;
    }

    // Validar formato de cédula (debe tener 11 dígitos)
    const cedulaNumbers = member.cedula.replace(/\D/g, "");
    if (cedulaNumbers.length !== 11) {
      setLoginError(true);
      return;
    }

    setIsLoggingIn(true);

    try {
      console.log("Buscando cédula:", cedulaNumbers);
      console.log("URL de búsqueda:", `${appSettings.apiUrl}/Members/byCedula/${cedulaNumbers}`);
      
      // Buscar la cédula en la base de datos
      const response = await fetch(
        `${appSettings.apiUrl}/Members/byCedula/${cedulaNumbers}`
      );

      console.log("Status de respuesta:", response.status);
      console.log("Headers de respuesta:", response.headers);

      if (response.ok) {
        const memberData = await response.json(); 
        console.log("Miembro encontrado:", memberData);
        
        // Crear objeto de usuario para guardar
        const userToSave = { 
          cedula: memberData.cedula, 
          nombre: memberData.nombre 
        };
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('loggedUser', JSON.stringify(userToSave));
        
        // Establecer usuario autenticado y cambiar a MainApp
        setLoggedUser(userToSave);
        setIsAuthenticated(true);
        
        // Limpiar formulario de login
        setMember(initialMember);
        setLoginError(false);
      } else if (response.status === 404) {
        console.log("Cédula no encontrada (404)");
        setErrorMessage(
          "La cédula no existe en el sistema. Por favor regístrese primero."
        );
        setShowErrorModal(true);
      } else {
        console.log("Error del servidor, status:", response.status);
        let errorMessage = "Error desconocido del servidor";
        
        try {
          const errorData = await response.json();
          console.error("Error en el servidor:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("No se pudo parsear el error:", parseError);
        }
        
        setErrorMessage(`Error al iniciar sesión: ${errorMessage}`);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage("Error de conexión. Intente nuevamente.");
      setShowErrorModal(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    // cargar comités
    fetch(`${appSettings.apiUrl}/Comites`)
      .then((r) => {
        if (!r.ok) {
          console.error("Error cargando comités:", r.status, r.statusText);
          return [];
        }
        return r.json();
      })
      .then((data: IComite[]) => {
        console.log("Comités cargados:", data);
        setComites(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error en fetch de comités:", error);
        setComites([]);
      });
  }, []);

  useEffect(() => {
    // setear rol por defecto = miembro
    fetch(`${appSettings.apiUrl}/Roles`)
      .then((r) => {
        if (!r.ok) {
          console.error("Error cargando roles:", r.status, r.statusText);
          return [];
        }
        return r.json();
      })
      .then((roles: IRol[]) => {
        console.log("Roles cargados:", roles);
        const miembro = Array.isArray(roles)
          ? roles.find((x) => (x.nombre || "").toLowerCase() === "miembro")
          : undefined;
        if (miembro) {
          console.log("Rol miembro encontrado:", miembro);
          setMember((prev) => ({ ...prev, rol_id: miembro.id }));
        } else {
          console.warn('Rol "miembro" no encontrado');
        }
      })
      .catch((error) => {
        console.error("Error en fetch de roles:", error);
      });
  }, []);

  useEffect(() => {
    const checkAuthAndLoading = async () => {
      console.log('Iniciando loading...');
      setIsLoading(true);
      
      // Simular un delay para mostrar el loading
      console.log('Esperando 10 segundos...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('Delay completado');
      
      const savedUser = localStorage.getItem('loggedUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setLoggedUser(user);
          setIsAuthenticated(true);
          console.log('Usuario encontrado en localStorage');
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('loggedUser');
        }
      } else {
        console.log('No hay usuario en localStorage');
      }
      console.log('Finalizando loading...');
      setIsLoading(false);
    };
    
    checkAuthAndLoading();
  }, []);

  console.log('Estado de loading:', isLoading);
  
  if (isLoading) {
    console.log('Mostrando LoadingScreen');
    return <LoadingScreen />;
  }

    return (
        <div className="auth-wrapper">
      {/* Si está autenticado, mostrar MainApp */}
      {isAuthenticated && loggedUser ? (
        <MainApp 
          initialUser={{
            cedula: loggedUser.cedula,
            nombre: loggedUser.nombre
          }}
        />
      ) : (
        <>
          {/* Notificación de éxito animada */}
          {showSuccess && (
            <div className="success-notification">
              <div className="success-content">
                <div className="success-icon">✓</div>
                <div className="success-text">¡Registro exitoso!</div>
              </div>
            </div>
          )}

          {/* Modal de error para login */}
          {showErrorModal && (
            <div className="error-modal-overlay">
              <div className="error-modal">
                <div className="error-icon-container">
                  <div className="error-icon-large">!</div>
                </div>
                <h2 className="error-title">Error al Iniciar Sesión</h2>
                <p className="error-message">{errorMessage}</p>
                <button
                  className="error-button"
                  onClick={() => setShowErrorModal(false)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

          <div
            className={`container ${isSignUp ? "right-panel-active" : ""}`}
            id="container"
          >
          {/* Sign Up */}
          <div className="form-container sign-up-container">
            <form>
                <h1 className="text-2xl font-bold">Registro</h1>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={member.nombre}
                  onChange={inputChangeValue}
                  required
                />
                <input
                  name="apellido"
                  type="text"
                  placeholder="Apellido"
                  value={member.apellido}
                  onChange={inputChangeValue}
                  required
                />
                <input
                  name="cedula"
                  type="text"
                  placeholder="Cédula"
                  value={member.cedula}
                  onChange={handleCedulaChange}
                  required
                  pattern="[0-9]{3}-[0-9]{7}-[0-9]"
                />
                <input
                  name="telefono"
                  type="tel"
                  placeholder="Telefono"
                  value={member.telefono}
                  onChange={handleTelefonoChange}
                  required
                  maxLength={14}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={inputChangeValue}
                  required
                />
                <input
                  name="sector"
                  type="text"
                  placeholder="Sector"
                  value={member.sector}
                  onChange={inputChangeValue}
                  required
                />
                <input
                  name="direccion"
                  type="text"
                  placeholder="Dirección"
                  value={member.direccion}
                  onChange={inputChangeValue}
                  className="span-2"
                  required
                />
                <select
                  name="comite_id"
                  value={member.comite_id}
                  onChange={inputChangeValue}
                  required
                  style={{
                    border: "2px solid #E39E41",
                    borderRadius: "10px",
                    padding: "10px",
                    outline: "none",
                  }}
                >
                  <option value={0}>Seleccione un comité</option>
                  {comites.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="mt-3 cursor-pointer bg-[#e39e41]"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Registrando..." : "Registrarme"}
                </button>
            </form>
          </div>
  
          {/* Sign In */}
          <div className="form-container sign-in-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
              <h1 className="text-2xl font-bold">Iniciar sesión</h1>
                <a style={{ pointerEvents: "none" }}>Introduzca su cédula:</a>
                <div className="input-container">
                  <input
                    name="cedula"
                    type="text"
                    placeholder="XXX-XXXXXXX-X"
                    value={member.cedula}
                    onChange={handleCedulaChange}
                    required
                    pattern="[0-9]{3}-[0-9]{7}-[0-9]"
                    className={loginError ? "input-error" : ""}
                  />
                  {loginError && <span className="error-icon">!</span>}
                </div>
                <button
                  type="button"
                  className="mt-3 cursor-pointer bg-[#00478e]"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Iniciando..." : "Entrar"}
                </button>
            </form>
          </div>
  
          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                  <button
                    className="ghost cursor-pointer mt-24"
                    onClick={() => setIsSignUp(false)}
                  >
                    Iniciar sesión
                  </button>
              </div>
              <div className="overlay-panel overlay-right ">
                  <button
                    className="ghost cursor-pointer mt-80"
                    onClick={() => setIsSignUp(true)}
                  >
                    Registrarme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
  );
}
