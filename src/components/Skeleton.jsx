import React from 'react';

export function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }} aria-busy="true" aria-label="Loading atmospheric data">
      {/* Asymmetric Hero Skeleton */}
      <div className="hero-asymmetric">
        <div className="hero-editorial-left" style={{ gap: 'var(--space-lg)' }}>
          <div>
            <div className="skeleton skeleton-text" style={{ width: '120px', height: '14px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '260px', height: '44px', marginTop: '8px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '180px', height: '18px' }}></div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div className="skeleton skeleton-hero-temp"></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton skeleton-text" style={{ width: '140px', height: '22px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '160px', height: '16px' }}></div>
            </div>
          </div>
        </div>

        <div className="verdict-card">
          <div>
            <div className="skeleton skeleton-text" style={{ width: '100px', height: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '90%', height: '28px', marginTop: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '18px', marginTop: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%', height: '18px', marginTop: '6px' }}></div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '9999px' }}></div>
              <div className="skeleton" style={{ width: '110px', height: '24px', borderRadius: '9999px' }}></div>
            </div>
          </div>
          <div className="skeleton" style={{ height: '54px', borderRadius: '8px' }}></div>
        </div>
      </div>

      {/* Comfort bar skeleton */}
      <div className="best-time-section">
        <div className="skeleton skeleton-text" style={{ width: '200px', height: '22px' }}></div>
        <div className="skeleton" style={{ height: '32px', borderRadius: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '14px' }}></div>
      </div>

      {/* Hourly strip skeleton */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ width: '80px', height: '100px', borderRadius: '8px', flexShrink: 0 }}></div>
        ))}
      </div>
    </div>
  );
}
