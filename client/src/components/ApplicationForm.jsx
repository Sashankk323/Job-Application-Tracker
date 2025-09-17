import { useState } from "react";

export default function ApplicationForm({ onCreate }) {
  const [form, setForm] = useState({
    company: "", position: "", status: "Applied",
    applied_date: "", resume_match_score: "", notes: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      company: form.company,
      position: form.position,
      status: form.status,
      applied_date: form.applied_date || null,
      resume_match_score: form.resume_match_score ? Number(form.resume_match_score) : null,
      notes: form.notes || null
    };
    await onCreate(payload);
    setForm({ company: "", position: "", status: "Applied", applied_date: "", resume_match_score: "", notes: "" });
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-semibold mb-3">Add Application</h2>
      <input className="border w-full p-2 rounded mb-2" placeholder="Company"
        value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
      <input className="border w-full p-2 rounded mb-2" placeholder="Position"
        value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
      <select className="border w-full p-2 rounded mb-2"
        value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Offer</option>
      </select>
      <input className="border w-full p-2 rounded mb-2" type="date"
        value={form.applied_date} onChange={e => setForm(f => ({ ...f, applied_date: e.target.value }))} />
      <input className="border w-full p-2 rounded mb-2" type="number" placeholder="Match Score (0-100)"
        value={form.resume_match_score} onChange={e => setForm(f => ({ ...f, resume_match_score: e.target.value }))} />
      <textarea className="border w-full p-2 rounded mb-3" placeholder="Notes"
        value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <button className="w-full bg-black text-white rounded p-2">Create</button>
    </form>
  );
}
