import axios from 'axios';
import type { Employee, EmployeeForm } from "../type";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const base = 'http://localhost:3003';

const axiosInstance = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
});

async function handleRes<T>(promise: Promise<any>): Promise<T> {
  try {
    const res = await promise;
     if (res?.data?.message) {
      toast.success(res.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    return res.data;
  } catch (err: any) {
     toast.success(err.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    throw err?.response?.data ?? { message: err.message || 'Network error' };
    
  }
}

export const employeeService = {
  async list(): Promise<Employee[]> {
    return handleRes<Employee[]>(axiosInstance.get('/employee/get'));
  },

  async create(payload: EmployeeForm): Promise<Employee> {
    return handleRes<Employee>(axiosInstance.post('/employee/add', payload));
  },

  async update(id: string, payload: EmployeeForm): Promise<Employee> {
    return handleRes<Employee>(axiosInstance.patch(`/employee/edit/${id}`, payload));
  },

  async remove(id: string): Promise<{ success?: boolean }> {
    return handleRes<{ success?: boolean }>(axiosInstance.delete(`/employee/delete/${id}`));
  },
};
