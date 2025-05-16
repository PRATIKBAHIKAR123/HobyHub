import { useEffect, useState } from "react";
import { getStoredToken } from "@/utils/localStorage";
import { AuthDialog } from "./login/authpopup";
import { httpClient } from "@/utils/httpClient";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

    useEffect(() => {
      const userToken = getStoredToken();
      console.log("userToken:", userToken);

      if (userToken) {
        setIsAuthenticated(true);
        // Set the auth modal callback for unauthorized responses
        httpClient.setAuthModalCallback((show) => {
          setShowAuthModal(show);
          setIsAuthenticated(!show);
        });
      } else {
        setShowAuthModal(true);
      }
    }, []);

    return (
      <>
        <div className={showAuthModal && !isAuthenticated ? "blur-sm pointer-events-none select-none transition-all duration-300" : "transition-all duration-300"}>
          <WrappedComponent {...props} blurred={showAuthModal && !isAuthenticated} />
        </div>
        <AuthDialog open={showAuthModal} setOpen={setShowAuthModal} />
      </>
    );
  };

  // ✅ Add a display name for debugging
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthComponent;
};

export default withAuth;