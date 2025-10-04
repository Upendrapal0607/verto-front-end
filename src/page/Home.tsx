// import EmployeeList from '../components/EmployeeList';
import { Link } from 'react-router-dom';
import { EmployeeList } from '../components/employeeList';

const Home = () => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold">Employee List</h1>
      <Link
        to="/employees/add"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Employee
      </Link>
    </div>
    <EmployeeList />
  </div>
);

export default Home;
