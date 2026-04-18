import { Suspense } from "react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

function HeaderFallback() {
  return (
    <div className="site-header site-header--fallback" aria-hidden="true">
      <div className="header-main">
        <div className="shell header-main-inner">
          <div className="brand">
            <span className="brand-mark" />
            <span className="brand-copy">
              <strong>Sophon Market</strong>
              <span>Fresh picks, weekly deals, and store support</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoreLayout({ children }) {
  return (
    <div className="storefront">
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main className="page-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
