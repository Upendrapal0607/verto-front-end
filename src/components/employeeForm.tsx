import React, { useEffect, useState } from 'react';
import type { EmployeeForm } from '../type';

type Props = {
  initial?: EmployeeForm;
  onCancel?: () => void;
  onSubmit: (data: EmployeeForm) => Promise<void> | void;
  submitLabel?: string;
};

const validate = (data: EmployeeForm) => {
  const errors: Partial<Record<keyof EmployeeForm, string>> = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Invalid email';
  if (!data.position || data.position.trim().length < 2) errors.position = 'Position is required';
  return errors;
};

export const EmployeeFormComponent: React.FC<Props> = ({ initial, onCancel, onSubmit, submitLabel = 'Save' }) => {
  const [form, setForm] = useState<EmployeeForm>(initial ?? { name: '', email: '', position: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeForm, string>>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handle = (k: keyof EmployeeForm, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={form.name}
          onChange={(e) => handle('name', e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="Full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          value={form.email}
          onChange={(e) => handle('email', e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Position</label>
        <input
          value={form.position}
          onChange={(e) => handle('position', e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="Job title"
        />
        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
