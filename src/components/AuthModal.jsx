import React, { useState } from 'react';
import { X, Lock, Mail, User, Users, LogIn, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [memberName, setMemberName] = useState('');
  const [role, setRole] = useState('Pai'); // 'Pai', 'Mãe', 'Filho', 'Membro'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!isSupabaseConfigured) {
      // Local fallback simulation if Supabase is not configured yet
      onAuthSuccess({
        id: 'user-local',
        name: memberName || 'Membro da Família',
        role,
        email: email || 'familia@local'
      });
      setLoading(false);
      onClose();
      return;
    }

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: memberName || email.split('@')[0],
              role
            }
          }
        });
        if (error) throw error;
        alert('Cadastro realizado! Faça login com seu e-mail e senha.');
        setIsRegistering(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        onAuthSuccess({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          role: data.user.user_metadata?.role || 'Membro'
        });
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erro de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {isRegistering ? 'Criar Conta Familiar' : 'Entrar no FinanFlow Familiar'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label">Seu Nome (ex: João, Maria...)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Perfil na Família</label>
                <select 
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Pai" style={{ background: 'var(--bg-modal)' }}>Pai</option>
                  <option value="Mãe" style={{ background: 'var(--bg-modal)' }}>Mãe</option>
                  <option value="Filho" style={{ background: 'var(--bg-modal)' }}>Filho / Filha</option>
                  <option value="Membro" style={{ background: 'var(--bg-modal)' }}>Outro Membro</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegistering ? 'Já tenho uma conta? Entrar' : 'Não tem conta? Cadastrar membro'}
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />}
              {loading ? 'Aguarde...' : isRegistering ? 'Cadastrar' : 'Entrar'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
