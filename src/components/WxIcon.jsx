import Icon from './Icon';

const WxIcon = ({ type, size = 28 }) => {
  const s = size;
  if (type === 'sun') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" fill="#E8A02D"/><g stroke="#E8A02D" strokeWidth="2" strokeLinecap="round"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"/></g></svg>
  );
  if (type === 'cloud-sun') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="16" cy="8" r="3" fill="#E8A02D"/><path d="M7 18a4 4 0 1 1 1-7.87 5 5 0 0 1 9.9 1.37A3.5 3.5 0 0 1 17 18H7z" fill="#fff" stroke="#E0E4EA" strokeWidth="1.5"/></svg>
  );
  if (type === 'cloud') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 1 1 1-7.87 5 5 0 0 1 9.9 1.37A3.5 3.5 0 0 1 17 18H7z" fill="#B8C0D0" stroke="#8892A6" strokeWidth="1.5"/></svg>
  );
  if (type === 'rain') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 14a4 4 0 1 1 1-7.87 5 5 0 0 1 9.9 1.37A3.5 3.5 0 0 1 17 14H7z" fill="#6B7A94" stroke="#4B5570" strokeWidth="1.5"/><g stroke="#2A5FB4" strokeWidth="2" strokeLinecap="round"><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/></g></svg>
  );
  return <Icon name="sun" size={s}/>;
};

export default WxIcon;
