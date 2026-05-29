export interface NavigationProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onStoriesClick: () => void;
  onPlantClick: () => void;
  onLoginClick: () => void;
  onContactClick?: () => void;
  isAuthenticated?: boolean;
  onDashboardClick?: () => void;
  onLogoutClick?: () => void;
  onIndividualClick?: () => void;
  onIndustriesClick?: () => void;
  onInstitutesClick?: () => void;
}
