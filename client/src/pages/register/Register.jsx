import React from "react"
import { useState } from "react"
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import useRegister from "../../hooks/useRegister.js";


const Register = () => {
    const [inputs, setInputs] = useState({
        username : "",
        email:"",
        password:""
    })
    const {register, loading} = useRegister();
    
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(inputs);



    }

    return(
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          
          {/* Header */}
          <h3 className="text-center fw-bold mb-2" style={{ fontSize: '1.75rem', color: '#212529' }}>
            Create Account
          </h3>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Please fill in the details to register.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Username</label>
              <input 
                type="text" 
                className="form-control form-control-lg shadow-none" 
                placeholder="johndoe"
                style={{ fontSize: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                value={inputs.username}
                onChange={(e)=>setInputs({...inputs, username:e.target.value})}
              />
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg shadow-none" 
                placeholder="name@example.com"
                style={{ fontSize: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                value={inputs.email}
                onChange={(e)=>setInputs({...inputs, email:e.target.value})}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg shadow-none" 
                placeholder="••••••••"
                style={{ fontSize: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                value={inputs.password}
                onChange={(e)=>setInputs({...inputs, password:e.target.value})}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ borderRadius: '8px', fontSize: '1rem', letterSpacing: '0.5px' }}
            >
              Register Now
            </button>

            {/* Footer Link */}
            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Already have an account? </span>
              <a href="#" className="text-decoration-none fw-bold" style={{ fontSize: '0.85rem' }}>Log In</a>
            </div>
          </form>

        </div>
      </div>
    </div>

  );

    
}

export default Register;