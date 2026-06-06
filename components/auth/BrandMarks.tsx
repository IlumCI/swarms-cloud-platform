import React from 'react';

type IconProps = { className?: string };

export function GoogleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6.1S8.7 5.9 12 5.9c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.8 2.4 2.6 6.6 2.6 11.8s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

export function GithubIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 7.07c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

export function XIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.804l4.713 6.231 5.473-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export function PhantomIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="phantom-bg" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#534BB1" />
          <stop offset="1" stopColor="#551BF9" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#phantom-bg)" />
      <path
        fill="#ffffff"
        d="M110.6 64.6c0-25.7-21-46.5-46.7-46.5-25 0-45.7 19.9-46.6 44.7-.1 1.2.9 2.2 2.1 2.2h17.3c1.5 0 2.7-1.1 2.8-2.6.9-12.3 11.2-22 23.7-22 13.1 0 23.7 10.6 23.7 23.7 0 13.1-10.6 23.7-23.7 23.7H28.8c-1.2 0-2.1.9-2.1 2.1v15.7c0 1.2.9 2.1 2.1 2.1h35.1c25.7-.1 46.7-21 46.7-46.6zM43.6 73.6c2.4 0 4.4-2 4.4-4.4 0-2.5-2-4.4-4.4-4.4-2.5 0-4.4 2-4.4 4.4 0 2.4 1.9 4.4 4.4 4.4zm21.4 0c2.5 0 4.4-2 4.4-4.4 0-2.5-2-4.4-4.4-4.4-2.5 0-4.4 2-4.4 4.4 0 2.4 2 4.4 4.4 4.4z"
      />
    </svg>
  );
}

export function SwarmsMark({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M90 2.5C138.325 2.5 177.5 41.6751 177.5 90C177.5 138.325 138.325 177.5 90 177.5C41.6751 177.5 2.5 138.325 2.5 90C2.5 41.6751 41.6751 2.5 90 2.5Z"
        stroke="#EE0712"
        strokeWidth="5"
        fill="none"
      />
      <path d="M78.1054 27.3887L90.0738 48.231L78.1054 69.0734H54.1685L42.2 48.231L54.1685 27.3887L78.1054 27.3887Z" fill="#F5070C" />
      <path d="M78.1054 111.367L90.0738 132.209L78.1054 153.052H54.1685L42.2 132.209L54.1685 111.367H78.1054Z" fill="#F5070C" />
      <path d="M54.1664 69.4016L66.1349 90.2439L54.1664 111.086H30.2296L18.2611 90.2439L30.2296 69.4016H54.1664Z" fill="#F5070C" />
      <path d="M126.168 27.3887L138.137 48.231L126.168 69.0734H102.232L90.2631 48.231L102.232 27.3887L126.168 27.3887Z" fill="#F5070C" />
      <path d="M126.168 111.367L138.137 132.209L126.168 153.052H102.232L90.2631 132.209L102.232 111.367H126.168Z" fill="#F5070C" />
      <path d="M102.23 69.4016L114.198 90.2439L102.23 111.086H78.2927L66.3242 90.2439L78.2927 69.4016H102.23Z" fill="#F5070C" />
      <path d="M150.293 69.4016L162.261 90.2439L150.293 111.086H126.356L114.387 90.2439L126.356 69.4016H150.293Z" fill="#F5070C" />
    </svg>
  );
}
