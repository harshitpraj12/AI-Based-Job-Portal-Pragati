import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import CompanyCard from '../../components/CompanyCard';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';
import { companyService } from '../../services/companyService';
import toast from 'react-hot-toast';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const navigate = useNavigate();

  const fetchCompanies = () => {
    setLoading(true);
    companyService.getAllCompanies()
      .then(res => setCompanies(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleEdit = (company) => setEditModal(company);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await companyService.updateCompany(editModal.id, editModal);
      toast.success('Company updated');
      setEditModal(null);
      fetchCompanies();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Companies</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your registered companies</p>
        </div>
        <Link
          to="/recruiter/companies/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)]"
        >
          <Plus size={18} /> Add Company
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          <LoadingSkeleton type="card" count={4} />
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description="Register your first company to start posting jobs."
          action={() => navigate('/recruiter/companies/new')}
          actionLabel="Add Company"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              showActions
              onEdit={handleEdit}
              onViewJobs={() => navigate(`/recruiter/jobs?companyId=${company.id}`)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Edit Company">
        {editModal && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {['companyName', 'website', 'location', 'description'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                {field === 'description' ? (
                  <textarea
                    value={editModal[field] || ''}
                    onChange={(e) => setEditModal({ ...editModal, [field]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={editModal[field] || ''}
                    onChange={(e) => setEditModal({ ...editModal, [field]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditModal(null)} className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
