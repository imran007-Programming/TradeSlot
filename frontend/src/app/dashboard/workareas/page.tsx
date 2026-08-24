'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { MapPin, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';
import { WorkArea } from '@/types';

export default function WorkAreasPage() {
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [showWorkAreaModal, setShowWorkAreaModal] = useState(false);
  const [editingWorkAreaId, setEditingWorkAreaId] = useState<string | null>(null);
  const [workAreaDate, setWorkAreaDate] = useState(new Date().toISOString().split('T')[0]);
  const [workAreaName, setWorkAreaName] = useState('');
  const [settingWorkArea, setSettingWorkArea] = useState(false);
  const [workAreaMessage, setWorkAreaMessage] = useState('');

  const fetchWorkAreas = async () => {
    try {
      const res = await apiClient.get('/work-area');
      if (res.success) {
        setWorkAreas(res.data || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchWorkAreas();
  }, []);

  const handleOpenAddModal = () => {
    setEditingWorkAreaId(null);
    setWorkAreaDate(new Date().toISOString().split('T')[0]);
    setWorkAreaName('');
    setWorkAreaMessage('');
    setShowWorkAreaModal(true);
  };

  const handleOpenEditModal = (wa: WorkArea) => {
    setEditingWorkAreaId(wa.id);
    setWorkAreaDate(new Date(wa.availableDate).toISOString().split('T')[0]);
    setWorkAreaName(wa.area);
    setWorkAreaMessage('');
    setShowWorkAreaModal(true);
  };

  const handleSaveWorkArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingWorkArea(true);
    setWorkAreaMessage('');
    try {
      if (editingWorkAreaId) {
        const res = await apiClient.patch('/work-area/' + editingWorkAreaId, {
          availableDate: workAreaDate,
          area: workAreaName,
        });
        if (res.success) {
          toast.success('Work area zone updated successfully!');
          setWorkAreaName('');
          setEditingWorkAreaId(null);
          setShowWorkAreaModal(false);
          await fetchWorkAreas();
          window.dispatchEvent(new Event('dashboard:refresh'));
        } else {
          toast.error(res.message || 'Failed to update work area zone');
        }
      } else {
        const res = await apiClient.post('/work-area/set-area', {
          availableDate: workAreaDate,
          area: workAreaName,
        });
        if (res.success) {
          toast.success('Work area zone saved successfully!');
          setWorkAreaName('');
          setShowWorkAreaModal(false);
          await fetchWorkAreas();
          window.dispatchEvent(new Event('dashboard:refresh'));
        } else {
          toast.error(res.message || 'Failed to save work area zone');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving work area');
    } finally {
      setSettingWorkArea(false);
    }
  };

  const handleDeleteWorkArea = (id: string) => {
    toast('Delete this work area?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await apiClient.delete('/work-area/' + id);
            if (res.success) {
              toast.success('Work area deleted!');
              await fetchWorkAreas();
              window.dispatchEvent(new Event('dashboard:refresh'));
            } else {
              toast.error(res.message || 'Failed to delete work area');
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">Work Area Zones</h2>
          <p className="text-xs text-slate-400 mt-0.5">Daily service coverage zones for slot availability</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Add Zone
        </button>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workAreas.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-slate-400 text-xs">
              No work areas configured yet.
            </div>
          ) : (
            workAreas.map((wa) => (
              <div
                key={wa.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative hover:border-[#E11D48] hover:shadow-md transition-all group"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(wa)}
                    className="text-slate-400 hover:text-[#0F172A] p-1 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
                    title="Edit Zone"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkArea(wa.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition cursor-pointer"
                    title="Delete Zone"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] flex items-center justify-center border border-[#E11D48]/30">
                  <MapPin size={18} className="text-[#E11D48]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-sm">{wa.area}</h3>
                <p className="text-xs text-slate-400">{new Date(wa.availableDate).toLocaleDateString()}</p>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} className="text-emerald-600" /> Active Zone
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WORK AREA MODAL (ADD / EDIT) */}
      {showWorkAreaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-[#0F172A]">
            <h3 className="text-base font-bold text-[#0F172A]">
              {editingWorkAreaId ? 'Update Work Area Zone' : 'Set Work Area Zone'}
            </h3>
            {workAreaMessage && <p className="text-xs font-bold text-[#E11D48]">{workAreaMessage}</p>}
            <form onSubmit={handleSaveWorkArea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Date</label>
                <DatePicker value={workAreaDate} onChange={setWorkAreaDate} placeholder="Select zone date" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. North London, Camden"
                  value={workAreaName}
                  onChange={(e) => setWorkAreaName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowWorkAreaModal(false);
                    setEditingWorkAreaId(null);
                  }}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={settingWorkArea}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-sm cursor-pointer"
                >
                  {settingWorkArea
                    ? editingWorkAreaId
                      ? 'Updating...'
                      : 'Saving...'
                    : editingWorkAreaId
                    ? 'Update Zone'
                    : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
