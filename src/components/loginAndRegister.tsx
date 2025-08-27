import { ChangeEvent, useState } from "react"
import { appSettings } from "../settings/appsettings"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { IMember } from "../interfaces/interfaces"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap"
import "../style/AuthForm.css"; // guarda los estilos aquí

const initialMember = {
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
    const navigate = useNavigate()


    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setMember({
            ...member,
            [inputName]: inputValue
        })
    }
    return (
        <div className="auth-wrapper">
        <div className={`container ${isSignUp ? "right-panel-active" : ""}`} id="container">
          {/* Sign Up */}
          <div className="form-container sign-up-container">
            <form>
              <h1>Create Account</h1>
              <div className="social-container">
                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span>or use your email for registration</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="button">Sign Up</button>
            </form>
          </div>
  
          {/* Sign In */}
          <div className="form-container sign-in-container">
            <form>
              <h1>Sign in</h1>
              <div className="social-container">
                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span>or use your account</span>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <a href="#">Forgot your password?</a>
              <button type="button">Sign In</button>
            </form>
          </div>
  
          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}