'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import {
  signInWithPasswordAction,
  signUpWithPasswordAction,
  signInWithMagicLinkAction,
  signInWithOAuthAction,
} from '@/lib/auth/actions';
import {
  signInWithPhantom,
  hasPhantomWallet,
  PHANTOM_INSTALL_URL,
} from '@/lib/auth/web3';
import {
  GoogleIcon,
  GithubIcon,
  XIcon,
  PhantomIcon,
} from './BrandMarks';

type Mode = 'login' | 'signup';
type Panel = 'providers' | 'email';

interface AuthFormProps {
  mode: Mode;
  initialError?: string | null;
}

const headingByMode: Record<Mode, string> = {
  login: 'Log into your account',
  signup: 'Create your account',
};

const switchPromptByMode: Record<Mode, { label: string; href: string; cta: string }> = {
  login: { label: "Don't have an account?", href: '/signup', cta: 'Sign up' },
  signup: { label: 'Already have an account?', href: '/login', cta: 'Log in' },
};

export function AuthForm({ mode, initialError = null }: AuthFormProps) {
  const [panel, setPanel] = useState<Panel>('providers');
  const [status, setStatus] = useState<{
    error: string | null;
    info: string | null;
  }>({ error: initialError, info: null });
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [phantomInstalled, setPhantomInstalled] = useState<boolean | null>(null);

  React.useEffect(() => {
    setPhantomInstalled(hasPhantomWallet());
  }, []);

  const heading = headingByMode[mode];
  const switchPrompt = switchPromptByMode[mode];

  const setError = (msg: string | null) =>
    setStatus({ error: msg, info: null });
  const setInfo = (msg: string | null) => setStatus({ error: null, info: msg });

  const handleOAuth = (provider: 'twitter' | 'google' | 'github') => {
    setPendingProvider(provider);
    setError(null);
    startTransition(async () => {
      const res = await signInWithOAuthAction(provider);
      if (!res.ok) {
        setError(res.error);
        setPendingProvider(null);
      }
      // On success the action redirects; the transition will resolve as the page navigates.
    });
  };

  const handlePhantom = async () => {
    if (!phantomInstalled) {
      window.open(PHANTOM_INSTALL_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setPendingProvider('phantom');
    setError(null);
    try {
      await signInWithPhantom();
      // Phantom sign-in completes client-side; refresh so the server
      // recognises the new session cookie.
      window.location.href = '/';
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Wallet sign-in failed. Please try again.',
      );
      setPendingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
          {heading}
        </h1>
        {panel === 'email' && (
          <p className="text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Enter your email and password.'
              : 'Create an account with email and password.'}
          </p>
        )}
      </div>

      {status.error && (
        <div
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger"
        >
          {status.error}
        </div>
      )}
      {status.info && (
        <div
          role="status"
          className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-xs text-success"
        >
          {status.info}
        </div>
      )}

      {panel === 'providers' ? (
        <ProvidersPanel
          mode={mode}
          pendingProvider={pendingProvider}
          phantomInstalled={phantomInstalled}
          onOAuth={handleOAuth}
          onPhantom={handlePhantom}
          onPickEmail={() => {
            setError(null);
            setPanel('email');
          }}
        />
      ) : (
        <EmailPanel
          mode={mode}
          onBack={() => {
            setError(null);
            setPanel('providers');
          }}
          onError={setError}
          onInfo={setInfo}
        />
      )}

      <div className="text-center text-sm text-muted-foreground">
        {switchPrompt.label}{' '}
        <Link
          href={switchPrompt.href}
          className="font-medium text-foreground hover:underline"
        >
          {switchPrompt.cta}
        </Link>
      </div>
    </div>
  );
}

function ProvidersPanel({
  mode,
  pendingProvider,
  phantomInstalled,
  onOAuth,
  onPhantom,
  onPickEmail,
}: {
  mode: Mode;
  pendingProvider: string | null;
  phantomInstalled: boolean | null;
  onOAuth: (p: 'twitter' | 'google' | 'github') => void;
  onPhantom: () => void;
  onPickEmail: () => void;
}) {
  const verb = mode === 'login' ? 'Login' : 'Sign up';
  const oauthProviders: Array<{
    id: 'twitter' | 'google' | 'github';
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'google', label: `${verb} with Google`, icon: <GoogleIcon /> },
    { id: 'github', label: `${verb} with GitHub`, icon: <GithubIcon /> },
  ];

  const phantomLabel =
    phantomInstalled === false
      ? 'Install Phantom Wallet'
      : 'Continue with Phantom';

  return (
    <div className="flex flex-col gap-2.5">
      <ProviderButton
        primary
        loading={pendingProvider === 'twitter'}
        disabled={pendingProvider !== null}
        icon={<XIcon />}
        label={`${verb} with X`}
        onClick={() => onOAuth('twitter')}
      />

      <button
        type="button"
        onClick={onPickEmail}
        disabled={pendingProvider !== null}
        className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        <Mail className="w-4 h-4" aria-hidden="true" />
        <span>{verb} with email</span>
      </button>

      {oauthProviders.map((p) => (
        <ProviderButton
          key={p.id}
          loading={pendingProvider === p.id}
          disabled={pendingProvider !== null}
          icon={p.icon}
          label={p.label}
          onClick={() => onOAuth(p.id)}
        />
      ))}

      <ProviderButton
        loading={pendingProvider === 'phantom'}
        disabled={pendingProvider !== null}
        icon={<PhantomIcon />}
        label={phantomLabel}
        onClick={onPhantom}
      />
    </div>
  );
}

function ProviderButton({
  primary = false,
  loading,
  disabled,
  icon,
  label,
  onClick,
}: {
  primary?: boolean;
  loading: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 w-full h-11 rounded-md text-sm font-medium transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  const variant = primary
    ? 'bg-foreground text-background hover:bg-foreground/90 border border-foreground'
    : 'bg-card text-foreground hover:bg-muted border border-border';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variant}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <span className="inline-flex items-center justify-center w-4 h-4">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}

function EmailPanel({
  mode,
  onBack,
  onError,
  onInfo,
}: {
  mode: Mode;
  onBack: () => void;
  onError: (msg: string | null) => void;
  onInfo: (msg: string | null) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [magicSubmitting, setMagicSubmitting] = useState(false);

  const submitLabel = mode === 'login' ? 'Sign in' : 'Create account';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onError(null);
    onInfo(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const action =
      mode === 'login' ? signInWithPasswordAction : signUpWithPasswordAction;

    try {
      const res = await action(formData);
      if (!res.ok) {
        onError(res.error);
      } else if (mode === 'signup') {
        onInfo(
          'Check your email for a confirmation link to finish setting up your account.',
        );
      }
    } catch (err) {
      // redirect() throws NEXT_REDIRECT; let it propagate
      if ((err as { digest?: string })?.digest?.startsWith?.('NEXT_REDIRECT')) {
        throw err;
      }
      onError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      onError('Enter your email to receive a magic link.');
      return;
    }
    onError(null);
    onInfo(null);
    setMagicSubmitting(true);

    const formData = new FormData();
    formData.set('email', email);

    const res = await signInWithMagicLinkAction(formData);
    setMagicSubmitting(false);

    if (!res.ok) {
      onError(res.error);
      return;
    }
    onInfo('Magic link sent. Check your email to finish signing in.');
  }

  const disabled = submitting || magicSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <button
        type="button"
        onClick={onBack}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-3 h-3" aria-hidden="true" />
        Other options
      </button>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@swarms.ai"
          className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-10 rounded-md border border-border bg-input text-foreground text-sm px-3 placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 border border-foreground transition-colors disabled:opacity-50"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        <span>{submitLabel}</span>
      </button>

      {mode === 'login' && (
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          {magicSubmitting && (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          )}
          <span>Email me a magic link instead</span>
        </button>
      )}
    </form>
  );
}
