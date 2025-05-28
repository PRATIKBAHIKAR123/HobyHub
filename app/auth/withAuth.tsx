'use client';
import { useEffect, useState, Suspense } from "react";
import { getStoredToken } from "@/utils/localStorage";
import { AuthDialog } from "./login/authpopup";
import { httpClient } from "@/utils/httpClient";
import { usePathname, useSearchParams } from "next/navigation";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const pathname = usePathname();

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <WithAuthContent 
          {...props} 
          WrappedComponent={WrappedComponent}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
          pathname={pathname}
        />
      </Suspense>
    );
  };

  // ✅ Add a display name for debugging
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthComponent;
};

// Separate component to use useSearchParams
const WithAuthContent = <P extends object>({
  WrappedComponent,
  isAuthenticated,
  setIsAuthenticated,
  showAuthModal,
  setShowAuthModal,
  pathname,
  ...props
}: P & {
  WrappedComponent: React.ComponentType<P>;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (value: boolean) => void;
  pathname: string;
}) => {
  const searchParams = useSearchParams();

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
      // Store the complete URL including query parameters
      const completeUrl = searchParams.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      // Transform the URL if it's a hobby-list with an ID
      const transformedUrl = completeUrl.replace(
        /^\/hobby-list\?id=(\d+)$/,
        '/hobby-list/hobby-details-page?id=$1'
      );

      localStorage.setItem('intendedDestination', transformedUrl);
      setShowAuthModal(true);
    }
  }, [pathname, searchParams, setIsAuthenticated, setShowAuthModal]);

  return (
    <>
      <div className={showAuthModal && !isAuthenticated ? "blur-sm pointer-events-none select-none transition-all duration-300" : "transition-all duration-300"}>
        <WrappedComponent {...props as P} blurred={showAuthModal && !isAuthenticated} />
      </div>
      <AuthDialog open={showAuthModal} setOpen={setShowAuthModal} />
    </>
  );
};

export default withAuth;