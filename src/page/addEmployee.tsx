import { EmployeeFormComponent } from "../components/employeeForm";

const AddEmployee = () => (
  <div className="p-6 max-w-lg mx-auto">
    <h1 className="text-2xl font-semibold mb-4">Add New Employee</h1>
    <EmployeeFormComponent />
  </div>
);

export default AddEmployee;
