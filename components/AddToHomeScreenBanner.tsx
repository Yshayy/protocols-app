import { useRouter } from 'next/router';
import * as React from 'react';

import styles from './styles.module.css';

const getOSInstructions = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  if (/android/i.test(userAgent)) {
    return {
      os: 'אנדרואיד',
      instructions: 'לחצו על תפריט הדפדפן (⋮) ובחרו "הוספה למסך הבית".'
    };
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return {
      os: 'iOS',
      instructions: 'לחצו על כפתור השיתוף (⤴) ובחרו "הוספה למסך הבית".'
    };
  } else {
    return {
      os: 'המכשיר שלך',
      instructions: 'השתמשו בתפריט הדפדפן כדי להוסיף את האפליקציה למסך הבית.'
    };
  }
};

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false;
  // iOS
  if ('standalone' in window.navigator && (window.navigator as any).standalone) return true;
  // Android
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
}

export function AddToHomeScreenBanner(){
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);
  const [osInfo, setOsInfo] = React.useState(getOSInstructions());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if banner has already been shown in this session
    const hasBeenShown = sessionStorage.getItem('addToHomeBannerShown');
    if (hasBeenShown) return;

    // Only show on mobile, not in standalone mode
    const isMobile = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isMobile && !isInStandaloneMode()) {
      setVisible(true);
      setOsInfo(getOSInstructions());
      sessionStorage.setItem('addToHomeBannerShown', 'true');
    }
  }, []);

  // Close banner on route change
  React.useEffect(() => {
    const handleRouteChange = () => {
      setVisible(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.addToHomeBanner} dir="rtl">
      <span>
        להוספת האפליקציה למסך הבית: <b>{osInfo.instructions}</b>
      </span>
      <button className={styles.closeBtn} onClick={handleClose} aria-label="סגור באנר">×</button>
    </div>
  );
};
