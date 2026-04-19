export const LOGO_FULL = '/assets/logo.png';
export const LOGO_BADGE = '/assets/logo-badge.png';

const Logo = ({ size = 44, compact = false }) => (
  <img src={compact ? LOGO_BADGE : LOGO_FULL} style={{ height: size }} alt="PrimeShine Detail Co." />
);

export default Logo;
