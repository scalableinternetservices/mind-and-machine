import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto flex">
        {/* Left sidebar */}
        <div className="w-64 fixed h-screen border-r border-gray-800">
          <div className="flex flex-col h-full p-4">
            <Sidebar />
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 ml-64 min-h-screen border-r border-gray-800 max-w-2xl">
          {children}
        </main>

        {/* Right sidebar - for trends and recommendations */}
        <div className="hidden lg:block w-80 pl-8">
          <div className="fixed w-80">
            {/* Add components for trends and recommendations */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 