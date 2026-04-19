const Stars = ({ n = 5, size = 14 }) => (
  <div className="star-scale" aria-label={`${n} out of 5 stars`}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= n ? '#E8A02D' : '#E7E9EE'}>
        <path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z"/>
      </svg>
    ))}
  </div>
);

export default Stars;
