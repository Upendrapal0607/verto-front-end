import React, { useMemo, useState } from 'react';
import { useEmployees } from '../context/employeeContext';
import type { Employee } from '../type';
import { Modal } from './model';
import { EmployeeFormComponent } from './employeeForm';
import DeleteConfirmation from './deleteConfirmation';

export const EmployeeList: React.FC = () => {
  const { items, loading, error, add, edit, remove, search, setSearch } = useEmployees();
  const [editing, setEditing] = useState<Employee | null>(null);
  const [addingOpen, setAddingOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [opLoading, setOpLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) => it.name.toLowerCase().includes(q) || it.email.toLowerCase().includes(q)
    );
  }, [items, search]);

  async function handleAdd(data: Omit<Employee, '_id'>) {
    setOpLoading(true);
    try {
      await add(data);
      setAddingOpen(false);
    } finally {
      setOpLoading(false);
    }
  }

  async function handleEdit(id: string, data: Omit<Employee, '_id'>) {
    setOpLoading(true);
    try {
      await edit(id, data);
      setEditing(null);
    } finally {
      setOpLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setOpLoading(true);
    try {
      await remove(id);
    } finally {
      setOpLoading(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
          <button
            onClick={() => setAddingOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            + Add Employee
          </button>
        </div>
        <div className="text-sm text-gray-600">{items.length} employees</div>
      </div>

      {loading && <div className="p-4">Loading...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}
      {!loading && !items.length && <div className="p-4 text-gray-600">No employees yet.</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Position</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((e) => (
              <tr key={e._id}>
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3">{e.email}</td>
                <td className="px-4 py-3 hidden md:table-cell">{e.position}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => setEditing(e)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(e._id!)}
                      className="px-3 py-1 border rounded text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      <Modal open={addingOpen} onClose={() => setAddingOpen(false)} title="Add Employee">
        <EmployeeFormComponent
          onCancel={() => setAddingOpen(false)}
          onSubmit={handleAdd}
          submitLabel={opLoading ? 'Saving...' : 'Create'}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Employee">
        {editing && (
          <EmployeeFormComponent
            initial={{ name: editing.name, email: editing.email, position: editing.position }}
            onCancel={() => setEditing(null)}
            onSubmit={(data) => handleEdit(editing._id!, data)}
            submitLabel={opLoading ? 'Saving...' : 'Update'}
          />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        message="This action cannot be undone. Are you sure?"
      />
    </div>
  );
};
