import React, { useState } from 'react';
import { Cloud, CloudOff, ShieldCheck, Users, Key, HelpCircle, X, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function CloudStatusBanner({ isCloudConnected, activeUser, onOpenAuthModal }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <div 
        style={{
          background: isSupabaseConfigured 
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)' 
            : 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: `1px solid ${isSupabaseConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8125rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSupabaseConfigured ? (
            <Cloud size={18} color="#10b981" />
          ) : (
            <CloudOff size={18} color="#f59e0b" />
          )}

          <div>
            {isSupabaseConfigured ? (
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                Sincronização em Nuvem Ativa
                {activeUser && (
                  <span style={{ color: '#10b981', marginLeft: '6px' }}>
                    • Conectado como <strong>{activeUser.name || activeUser.email}</strong>
                  </span>
                )}
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>
                <strong>Modo Local (Sem Nuvem):</strong> Seus dados estão salvos apenas neste navegador.
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isSupabaseConfigured && (
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <HelpCircle size={14} color="#f59e0b" /> Como Conectar no Supabase Grátis
            </button>
          )}

          {isSupabaseConfigured && !activeUser && (
            <button 
              onClick={onOpenAuthModal}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              <Users size={14} /> Fazer Login / Entrar na Família
            </button>
          )}
        </div>
      </div>

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="modal-overlay" onClick={() => setIsGuideOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cloud size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Passo a Passo: Ativar Nuvem Familiar Grátis</h3>
              </div>
              <button className="btn-icon" onClick={() => setIsGuideOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p>
                Para você, sua esposa e seu filho poderem acessar e sincronizar o FinanFlow em tempo real nos celulares e computadores de vocês:
              </p>

              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  Acesse <strong><a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>Supabase.com <ExternalLink size={12} /></a></strong> e crie uma conta gratuita.
                </li>
                <li>
                  Crie um novo projeto (ex: <code>finanflow-familia</code>).
                </li>
                <li>
                  No painel do Supabase, vá em <strong>SQL Editor</strong>, cole o conteúdo do arquivo <code>supabase_schema.sql</code> (salvo na pasta do projeto) e clique em <strong>RUN</strong>.
                </li>
                <li>
                  Em <strong>Project Settings ➔ API</strong>, copie a <code>URL</code> e a <code>anon public key</code>.
                </li>
                <li>
                  Cole essas chaves dentro do arquivo <code>.env</code> na pasta do seu projeto no computador:
                  <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem', marginTop: '6px', color: '#10b981' }}>
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui`}
                  </pre>
                </li>
              </ol>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '0.78rem' }}>
                💡 Enquanto as chaves não forem inseridas no <code>.env</code>, o app continuará funcionando normalmente no modo local sem perder nada!
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setIsGuideOpen(false)}>Entendi</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
