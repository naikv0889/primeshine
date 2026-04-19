import Icon from './Icon';

const Button = ({ children, variant = 'primary', size, icon, iconRight, onClick, href, disabled, type, className = '' }) => {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''} ${className}`.trim();
  const inner = (<>
    {icon && <Icon name={icon} size={16} />}
    {children}
    {iconRight && <Icon name={iconRight} size={16} />}
  </>);
  if (href) return <a className={cls} href={href} onClick={onClick}>{inner}</a>;
  return <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>{inner}</button>;
};

export default Button;
