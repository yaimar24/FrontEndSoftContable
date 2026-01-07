import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login  as apiLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../models/Auth';

const LoginForm = () => {
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiLogin(form);
      if (response.success && response.data) {
        login(response.data.token, response.data.expiration);
        navigate('/dashboard');
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded"
        required
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-blue-800 text-white font-bold rounded hover:bg-black transition"
      >
        {loading ? 'Cargando...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
