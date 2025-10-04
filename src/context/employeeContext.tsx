import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../type';

type State = {
  items: Employee[];
  loading: boolean;
  error?: string | null;
  search: string;
};

type Action =
  | { type: 'loading' }
  | { type: 'set'; payload: Employee[] }
  | { type: 'add'; payload: Employee }
  | { type: 'update'; payload: Employee }
  | { type: 'remove'; payload: string }
  | { type: 'error'; payload?: string }
  | { type: 'setSearch'; payload: string };

const initialState: State = {
  items: [],
  loading: false,
  error: null,
  search: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null };
    case 'set':
      return { ...state, items: action.payload, loading: false, error: null };
    case 'add':
      return { ...state, items: [action.payload, ...state.items] };
    case 'update':
      return {
        ...state,
        items: state.items.map((it) => (it._id === action.payload._id ? action.payload : it)),
      };
    case 'remove':
      return { ...state, items: state.items.filter((it) => it._id !== action.payload) };
    case 'error':
      return { ...state, loading: false, error: action.payload ?? 'Unknown error' };
    case 'setSearch':
      return { ...state, search: action.payload };
    default:
      return state;
  }
}

const EmployeeContext = createContext<
  | (State & {
      fetchAll: () => Promise<void>;
      add: (payload: Omit<Employee, '_id'>) => Promise<void>;
      edit: (id: string, payload: Omit<Employee, '_id'>) => Promise<void>;
      remove: (id: string) => Promise<void>;
      setSearch: (q: string) => void;
    })
  | undefined
>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAll = async () => {
    dispatch({ type: 'loading' });
    try {
      const list = await employeeService.list();
      dispatch({ type: 'set', payload: list?.data?.employee });
    } catch (err: any) {
      dispatch({ type: 'error', payload: err?.message ?? String(err) });
    }
  };

  const add = async (payload: Omit<Employee, '_id'>) => {
    try {
      const created = await employeeService.create(payload);
      dispatch({ type: 'add', payload: created });
     await fetchAll()
    } catch (err: any) {
      dispatch({ type: 'error', payload: err?.message ?? String(err) });
      throw err;
    }
  };

  const edit = async (id: string, payload: Omit<Employee, '_id'>) => {
    try {
      const updated = await employeeService.update(id, payload);
      dispatch({ type: 'update', payload: updated });
      await fetchAll();
    } catch (err: any) {
      dispatch({ type: 'error', payload: err?.message ?? String(err) });
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await employeeService.remove(id);
      dispatch({ type: 'remove', payload: id });
      await fetchAll()
    } catch (err: any) {
      dispatch({ type: 'error', payload: err?.message ?? String(err) });
      throw err;
    }
  };

  const setSearch = (q: string) => dispatch({ type: 'setSearch', payload: q });

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <EmployeeContext.Provider value={{ ...state, fetchAll, add, edit, remove, setSearch }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
};
