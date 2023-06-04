import { useEffect } from 'react';

interface GoogleAdsenseProps {
  className: string;
  style: React.CSSProperties;
}

const GoogleAdsense = ({ className, style }: GoogleAdsenseProps) => {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  });

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-6716507578577422"
      data-ad-slot="6085830267"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAdsense;
