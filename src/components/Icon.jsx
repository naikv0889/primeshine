const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.75 }) => {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    arrowLeft: <path d="M19 12H5m6-6-6 6 6 6"/>,
    check: <path d="M5 12l5 5L20 7"/>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    car: <><path d="M4 16h16M6 16v2m12-2v2M3 16l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6"/><circle cx="7" cy="16" r="1.5"/><circle cx="17" cy="16" r="1.5"/></>,
    shield: <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3z"/>,
    sparkle: <path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l4 4m4 4 4 4M18 6l-4 4m-4 4-4 4"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2M6 6l1.5 1.5M16.5 16.5 18 18M6 18l1.5-1.5M16.5 7.5 18 6"/></>,
    cloud: <path d="M7 18a4 4 0 1 1 1-7.87 5 5 0 0 1 9.9 1.37A3.5 3.5 0 0 1 17 18H7z"/>,
    rain: <><path d="M7 15a4 4 0 1 1 1-7.87 5 5 0 0 1 9.9 1.37A3.5 3.5 0 0 1 17 15H7z"/><path d="M8 19l-1 2m4-2-1 2m4-2-1 2m4-2-1 2"/></>,
    wind: <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8"/>,
    drop: <path d="M12 3s-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z"/>,
    location: <><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    phone: <path d="M22 17v3a2 2 0 0 1-2 2 19 19 0 0 1-17-17 2 2 0 0 1 2-2h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 5-6 8-6s7 2 8 6"/></>,
    users: <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.5-3 3-5 6-5s5.5 2 6 5"/><path d="M16 11a3 3 0 1 0 0-6m5 15c-.3-2-2-3.5-4-4"/></>,
    credit: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    star: <path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4.5-4.5"/></>,
    filter: <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    x: <path d="M6 6l12 12M6 18 18 6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    chevR: <path d="m9 6 6 6-6 6"/>,
    chevL: <path d="m15 6-6 6 6 6"/>,
    chevD: <path d="m6 9 6 6 6-6"/>,
    trend: <path d="M3 17l6-6 4 4 7-7M14 8h6v6"/>,
    dots: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
    trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/>,
    download: <path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>,
    upload: <path d="M12 21V9m-5 5 5-5 5 5M5 3h14"/>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></>,
    home: <path d="M3 10 12 3l9 7v11a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10z"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7.5 7.5 0 0 0-.1-1.4l2-1.5-2-3.4-2.3.9a7.5 7.5 0 0 0-2.4-1.4L13.8 3h-3.6l-.4 2.3a7.5 7.5 0 0 0-2.4 1.4l-2.3-.9-2 3.4 2 1.5A7.5 7.5 0 0 0 5 12c0 .5 0 1 .1 1.4l-2 1.5 2 3.4 2.3-.9a7.5 7.5 0 0 0 2.4 1.4l.4 2.2h3.6l.4-2.2a7.5 7.5 0 0 0 2.4-1.4l2.3.9 2-3.4-2-1.5c.1-.5.1-.9.1-1.4z"/></>,
    zap: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8z"/>,
    tag: <><path d="M20 12 12 20l-9-9V3h8l9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/></>,
    wrench: <path d="M15 4a5 5 0 0 0-6.1 6.1l-6.3 6.3a2 2 0 1 0 2.9 2.9l6.3-6.3A5 5 0 0 0 20 7l-3 3-2-2 3-3a5 5 0 0 0-3-1z"/>,
    message: <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
};

export default Icon;
