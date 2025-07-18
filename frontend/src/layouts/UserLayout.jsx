import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const UserLayout = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 HealthyFood. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout; 