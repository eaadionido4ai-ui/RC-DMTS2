import type { CSSProperties, FormEvent } from 'react';
import { useAnchor } from '../context';
import { I } from '../data';
import { initials } from '../logic';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';
import { UPRI_LOGO, UP_LOGO } from '../ui/brand';
import { LogoMark } from '../ui/LogoMark';
import { FieldLabel } from '../ui/primitives';
import { card, col } from '../ui/styles';

/** DRRM AID shortcuts that work before anyone signs in. */
const AID_SHORTCUTS: { k: string; label: string; icon: string; bg?: string; ink?: string; border?: string }[] = [
  { k: 'sos', label: 'SOS', icon: I.shield, bg: C.red, ink: C.white, border: C.red },
  { k: 'id', label: 'My ID', icon: I.qr },
  { k: 'alerts', label: 'Alerts', icon: I.bell },
  { k: 'map', label: 'Evac map', icon: I.map },
  { k: 'hotlines', label: 'Hotlines', icon: I.phone },
  { k: 'switch', label: 'Switch ID', icon: I.swap },
];

const inputStyle: CSSProperties = {
  height: 48,
  border: `1.5px solid ${C.line}`,
  borderRadius: 12,
  padding: '0 14px',
  color: C.ink,
  background: C.white,
  outline: 'none',
};

export function GateHome() {
  const a = useAnchor();
  const { s, user } = a;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    a.signIn();
  };

  return (
    <div style={col(16)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <img src={UP_LOGO} alt="University of the Philippines" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <img src={UPRI_LOGO} alt="UP Resilience Institute" style={{ width: 18, height: 18, objectFit: 'contain' }} />
          <span style={{ font: font('600 10.5px/1.2', 'body'), color: C.muted }}>UP Resilience Institute</span>
        </div>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            font: font('600 10.5px/1', 'body'),
            color: C.greenInk,
            background: C.greenTint,
            padding: '5px 8px',
            borderRadius: 99,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
          Works offline
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 2px' }}>
        <LogoMark concept={a.settings.logoConcept} size={64} />
        <div style={{ ...col(5), minWidth: 0 }}>
          <h1 style={{ margin: 0, font: font('800 34px/1', 'cond'), letterSpacing: '5px', color: C.navy }}>ANCHOR</h1>
          <div style={{ font: font('500 11.5px/1.35', 'body'), color: C.muted, textWrap: 'pretty' }}>
            Accountability, Needs, and Coordination Hub for Operational Response
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 18, overflow: 'hidden', background: C.navy, color: C.white, boxShadow: '0 10px 24px rgba(11,34,55,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: C.navy2,
              display: 'grid',
              placeItems: 'center',
              font: font('800 16px/1', 'cond'),
              flex: 'none',
            }}
          >
            {initials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0, ...col(4) }}>
            <span style={{ font: font('800 10px/1', 'cond'), letterSpacing: '1.2px', textTransform: 'uppercase', color: C.amber }}>
              DRRM AID · saved on this phone
            </span>
            <span style={{ font: font('800 18px/1.1', 'cond') }}>{user.name}</span>
            <span style={{ font: font('600 11.5px/1', 'mono'), color: C.navyInk }}>
              {user.code} · {user.org}
            </span>
          </div>
          <button
            type="button"
            onClick={() => a.openGateAid('id')}
            aria-label="Show my ID"
            style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,.1)', color: C.white, display: 'grid', placeItems: 'center' }}
          >
            <Icon d={I.qr} size={20} />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 14px',
            background: C.navy2,
            font: font('600 11px/1.3', 'body'),
            color: C.navyInk,
          }}
        >
          <Icon d={I.lock} size={14} strokeWidth={2} />
          IMT credential sealed. Not shown on this card.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 4 }}>
        {AID_SHORTCUTS.map((x) => (
          <button
            key={x.k}
            type="button"
            className="press-94"
            onClick={() => (x.k === 'switch' ? a.openSheet() : a.openGateAid(x.k))}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: x.bg ?? C.white,
                color: x.ink ?? C.ink,
                border: `1px solid ${x.border ?? C.line}`,
              }}
            >
              <Icon d={x.icon} />
            </span>
            <span style={{ font: font('600 10px/1.15', 'body'), color: C.ink2, textAlign: 'center' }}>{x.label}</span>
          </button>
        ))}
      </div>

      {s.limited ? (
        <div
          role="alert"
          style={{
            background: C.amberTint,
            border: `1px solid ${C.amberLine}`,
            borderRadius: 18,
            padding: 16,
            ...col(8),
          }}
        >
          <div style={{ font: font('800 17px/1.15', 'cond'), color: C.amberInk }}>Code does not match this DRRM AID</div>
          <div style={{ font: font('500 12.5px/1.5', 'body'), color: C.amberInk }}>
            Responder modules stay closed on this phone. DRRM AID is still available.
          </div>
          <button
            type="button"
            onClick={a.retrySignIn}
            style={{
              height: 44,
              borderRadius: 12,
              background: C.white,
              border: `1.5px solid ${C.amberLine}`,
              font: font('700 13.5px', 'body'),
              color: C.amberInk,
              marginTop: 4,
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ ...card(18, 16), ...col(11) }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: font('800 18px/1', 'cond') }}>Responder sign-in</span>
            <span style={{ font: font('700 10px/1', 'body'), color: C.teal, background: C.tealTint, padding: '4px 8px', borderRadius: 99 }}>
              IMT members
            </span>
          </div>
          <div style={col(6)}>
            <FieldLabel htmlFor="imt-code">IMT code</FieldLabel>
            <input
              id="imt-code"
              className="focus-teal"
              value={s.code}
              onChange={(e) => a.set({ code: e.target.value })}
              placeholder="Your private code"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              style={{ ...inputStyle, font: font('700 15px', 'mono'), letterSpacing: '2px', textTransform: 'uppercase' }}
            />
          </div>
          <div style={col(6)}>
            <FieldLabel htmlFor="imt-pin">PIN</FieldLabel>
            <input
              id="imt-pin"
              className="focus-teal"
              type="password"
              value={s.pin}
              onChange={(e) => a.set({ pin: e.target.value })}
              placeholder="••••"
              autoComplete="off"
              style={{ ...inputStyle, font: font('600 15px', 'body'), letterSpacing: '4px' }}
            />
          </div>
          <button
            type="submit"
            className="hover-navy2 press-98"
            style={{
              height: 52,
              borderRadius: 14,
              background: C.navy,
              color: C.white,
              font: font('700 16px', 'body'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 2,
            }}
          >
            Sign in
            <Icon d={I.arrow} size={18} strokeWidth={2.2} />
          </button>
          <div style={{ font: font('400 11px/1.45', 'body'), color: C.faint, textAlign: 'center', textWrap: 'pretty' }}>
            Checked against the sealed credential in {user.code}. Your position sets which modules open.
          </div>
        </form>
      )}
    </div>
  );
}
