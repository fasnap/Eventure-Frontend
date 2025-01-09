// Layout.js

import Header from "../Header";
import Footer from "./footer";

function Layout({ children }) {
  return (
    <div className="font-sans text-primary bg-gray-50 min-h-screen">
      <Header />
      <main className="p-4 max-w-8xl">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
