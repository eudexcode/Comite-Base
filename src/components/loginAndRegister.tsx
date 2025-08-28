import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"
import { appSettings } from "../settings/appsettings"
import type { IMember } from "../interfaces/IMember"
import type { IComite } from "../interfaces/IComite"
import type { IRol } from "../interfaces/IRol"
import "../style/AuthForm.css";

const initialMember: IMember = {
    id: 0,
    nombre: "",
    cedula: "",
    telefono: "",
    email: "",
    direccion: "",
    sector: "",
    comite: 0,
    rol: 0,
    fecha_ingreso: new Date(),
    estado: true,
}

export function LoginAndRegister() {

    const [isSignUp, setIsSignUp] = useState(false);
    const [member, setMember] = useState<IMember>(initialMember)
    const [comites, setComites] = useState<IComite[]>([])

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = event.target.name;
        const rawValue = event.target.value;
        const inputValue = inputName === "comite" || inputName === "rol" ? Number(rawValue) : rawValue;
        setMember(prev => ({ ...prev, [inputName]: inputValue }))
    }

    useEffect(() => {
        // cargar comités
        fetch(`${appSettings.apiUrl}Comites`)
            .then(r => r.ok ? r.json() : [])
            .then((data: IComite[]) => setComites(Array.isArray(data) ? data : []))
            .catch(() => setComites([]))
    }, [])

    useEffect(() => {
        // setear rol por defecto = miembro
        fetch(`${appSettings.apiUrl}Roles`)
            .then(r => r.ok ? r.json() : [])
            .then((roles: IRol[]) => {
                const miembro = Array.isArray(roles) ? roles.find(x => (x.nombre || "").toLowerCase() === "miembro") : undefined;
                if (miembro) setMember(prev => ({ ...prev, rol: miembro.id }));
            })
            .catch(() => {})
    }, [])
    return (
        <div className="auth-wrapper">
        <div className={`container ${isSignUp ? "right-panel-active" : ""}`} id="container">
          {/* Sign Up */}
          <div className="form-container sign-up-container">
            <form>
              <h1 className="text-2xl font-bold">Registro</h1>
              <input name="nombre" type="text" placeholder="Nombre" value={member.nombre} onChange={inputChangeValue} />
              <input name="cedula" type="text" placeholder="Cédula" value={member.cedula} onChange={inputChangeValue} />
              <input name="telefono" type="text" placeholder="Teléfono" value={member.telefono} onChange={inputChangeValue} />
              <input name="email" type="email" placeholder="Email" value={member.email} onChange={inputChangeValue} />
              <input name="direccion" type="text" placeholder="Dirección" value={member.direccion} onChange={inputChangeValue} className="span-2" />
              <input name="sector" type="text" placeholder="Sector" value={member.sector} onChange={inputChangeValue} className="span-2" />
              <select
                name="comite"
                value={member.comite}
                onChange={inputChangeValue}
                style={{
                  border: '2px solid #E39E41',
                  borderRadius: '10px',
                  padding: '10px',
                  outline: 'none'
                }}
              >
                <option value={0}>Seleccione un comité</option>
                {comites.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <button type="button" className="mt-3 cursor-pointer bg-[#e39e41]">Registrarme</button>
            </form>
          </div>
  
          {/* Sign In */}
          <div className="form-container sign-in-container">
            <form>
              <h1 className="text-2xl font-bold">Iniciar sesión</h1>
              <a style={{pointerEvents: "none"}}>Introduzca su cédula:</a>
              <input type="text" placeholder="XXX-XXXXXXX-X" />
              <button type="button" className="mt-3 cursor-pointer bg-[#00478e]">Entrar</button>
            </form>
          </div>
  
          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
{/*                 <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p> */}
                <button className="ghost cursor-pointer mt-24" onClick={() => setIsSignUp(false)}>Iniciar sesión</button>
              </div>
              <div className="overlay-panel overlay-right ">
{/*                 <h1>Bienvenido!</h1>
                <p>Si aun no perteneces a ningun comite de base, puedes hacerlo ahora!</p> */}
                <button className="ghost cursor-pointer mt-80" onClick={() => setIsSignUp(true)}>Registrarme</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}