import useResponsive from "./useResponsive";

export const useNativeShare = () => {
  const { isMobile } = useResponsive();

  return {
    enabled: isMobile && !!navigator.share,
    share: navigator.share,
  };
};
