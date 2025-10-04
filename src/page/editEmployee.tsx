import { useParams } from 'react-router-dom';
import { EmployeeFormComponent } from '../components/employeeForm';

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Employee</h1>
      <EmployeeFormComponent employeeId={id} />
    </div>
  );
};

export default EditEmployee;
