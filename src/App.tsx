import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/Home';
import AddEmployee from './page/addEmployee';
import NotFound from './page/notFound';
import EditEmployee from './page/editEmployee';
import { EmployeeProvider } from './context/employeeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <EmployeeProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<Home />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
           <ToastContainer />
      </div>
    </EmployeeProvider>
  );
}

export default App;
