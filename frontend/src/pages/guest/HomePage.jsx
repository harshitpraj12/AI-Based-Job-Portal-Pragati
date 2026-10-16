import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, MapPin, Briefcase, Building2, Users, Award, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import JobCard from '../../components/JobCard';
import { jobService } from '../../services/jobService';
import { stats, testimonials, topCompanies } from '../../data/dummyData';
import { getInitials } from '../../utils/helpers';

const iconMap = { Briefcase, Building2, Users, Award };

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    jobService.getAllJobs()
      .then(res => setJobs(res.data?.slice(0, 6) || []))
      .catch(() => {});
  }, []);

  const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500 opacity-[0.04] blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-full)] bg-[var(--accent-subtle)] text-[var(--accent)] text-sm font-medium mb-6"
            >
              <Briefcase size={14} />
              AI-Powered Job Matching
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
              Find Your{' '}
              <span className="gradient-text">Dream Job</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with top companies and get hired faster. Our AI-powered platform matches your skills with the perfect opportunities.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8"
            >
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title or keyword"
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all shadow-[var(--shadow-sm)]"
                />
              </div>
              <div className="relative flex-1">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all shadow-[var(--shadow-sm)]"
                />
              </div>
              <Link
                to={`/jobs?keyword=${search}&location=${location}`}
                className="px-8 py-3.5 bg-[var(--accent)] text-white font-semibold rounded-[var(--radius-lg)] hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] flex items-center justify-center gap-2 shrink-0"
              >
                Browse Jobs <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
              <span>Popular:</span>
              {['React Developer', 'Python', 'Data Science', 'Product Manager'].map((tag) => (
                <Link
                  key={tag}
                  to={`/jobs?keyword=${tag}`}
                  className="px-3 py-1 rounded-[var(--radius-full)] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-16 border-y border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.icon];
              return (
                <motion.div key={stat.label} variants={fadeUp} className="text-center">
                  <div className="inline-flex p-3 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] mb-3">
                    <Icon size={28} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Jobs ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Featured Jobs</h2>
              <p className="text-[var(--text-muted)] mt-1">Latest opportunities from top companies</p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {jobs.map((job) => (
              <motion.div key={job.id} variants={fadeUp}>
                <JobCard job={job} showApply={false} />
              </motion.div>
            ))}
          </motion.div>

          {jobs.length === 0 && (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No jobs available yet. Check back soon!</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]"
            >
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Top Companies ─── */}
      <section className="py-20 bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Top Companies Hiring</h2>
            <p className="text-[var(--text-muted)] mt-2">Join leading organizations around the world</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {topCompanies.map((company) => (
              <motion.div
                key={company.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-global)] hover:shadow-[var(--shadow-md)] transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] font-bold text-lg mb-3">
                  {getInitials(company.name)}
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)] text-center">{company.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 text-center">{company.location}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Success Stories</h2>
            <p className="text-[var(--text-muted)] mt-2">Hear from candidates who found their dream jobs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-8 md:p-12 border border-[var(--border-color)] shadow-[var(--shadow-md)]">
              <Quote size={32} className="text-[var(--accent)] opacity-30 mb-4" />
              <p className="text-lg text-[var(--text-primary)] leading-relaxed mb-6 italic">
                "{testimonials[testimonialIdx].quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(testimonials[testimonialIdx].name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{testimonials[testimonialIdx].name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{testimonials[testimonialIdx].role}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={prevTestimonial} className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
                  <ChevronLeft size={18} className="text-[var(--text-muted)]" />
                </button>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIdx ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'}`}
                    />
                  ))}
                </div>
                <button onClick={nextTestimonial} className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer">
                  <ChevronRight size={18} className="text-[var(--text-muted)]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[var(--radius-xl)] p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, #6366F1 50%, #8B5CF6 100%)',
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Take the Next Step?
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                Join thousands of professionals who've already found their perfect career match.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-white text-[var(--accent)] font-semibold rounded-[var(--radius-lg)] hover:bg-white/90 transition-colors shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/jobs"
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-[var(--radius-lg)] hover:bg-white/10 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
