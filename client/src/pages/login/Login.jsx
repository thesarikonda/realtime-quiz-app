import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";


const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {login} = useLogin();


    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({email,password})
        navigate('/');

    }

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          
          {/* Header */}
          <h3 className="text-center fw-bold mb-2" style={{ fontSize: '1.75rem', color: '#212529' }}>
            Welcome Back
          </h3>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Please enter your credentials to log in.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg shadow-none" 
                placeholder="name@example.com"
                style={{ fontSize: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
                <a href="#" className="text-decoration-none" style={{ fontSize: '0.8rem' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="form-control form-control-lg shadow-none" 
                placeholder="••••••••"
                style={{ fontSize: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="mb-4 form-check">
              <input type="checkbox" className="form-check-input shadow-none" id="rememberMe" />
              <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '0.85rem' }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ borderRadius: '8px', fontSize: '1rem', letterSpacing: '0.5px' }}
            >
              Log In
            </button>

            {/* Footer Link */}
            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Don't have an account? </span>
              <a href="/register" className="text-decoration-none fw-bold" style={{ fontSize: '0.85rem' }}>Sign Up</a>
            </div>
          </form>

        </div>
      </div>
    </div>
    )
}

export default Login;