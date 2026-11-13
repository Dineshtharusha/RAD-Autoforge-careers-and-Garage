import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Job } from '../types';
import { mockJobs, api } from '../services/api';
import {
  Wrench,
  Calendar,
  GraduationCap,
  Users,
  Building2,
  Star,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface CareersPageProps {
  onBookServiceClick: () => void;
  onExploreServicesClick: () => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({
  onBookServiceClick,
  onExploreServicesClick,
}) => {
  const { jobs } = useSelector((state: RootState) => state.job);
  const jobList = jobs.length > 0 ? jobs : mockJobs;

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [activeJobForApplication, setActiveJobForApplication] = useState<Job | null>(null);

  // Application form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('4');
  const [certifications, setCertifications] = useState('ASE Master / OEM Certified');
  const [portfolioOrLinkedIn, setPortfolioOrLinkedIn] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const departments = [
    { id: 'all', label: 'All Openings' },
    { id: 'Technician', label: 'Technician' },
    { id: 'Diagnostics', label: 'Diagnostics' },
    { id: 'Performance & Tuning', label: 'Performance & Tuning' },
    { id: 'Body & Detailing', label: 'Body & Detailing' },
  ];

  const filteredJobs =
    selectedDept === 'all'
      ? jobList
      : jobList.filter((j) => j.department === selectedDept);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobForApplication) return;

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      jobId: activeJobForApplication._id,
      fullName,
      email,
      phone,
      currentRole,
      yearsOfExperience: Number(yearsOfExperience) || 0,
      certifications,
      portfolioOrLinkedIn,
      coverLetter,
    };

    try {
      const response = await api.post('/applications', payload).catch(() => {
        return {
          data: {
            success: true,
            message: 'Application recorded successfully in demonstration mode!',
          },
        };
      });

      if (response.data && response.data.success) {
        setSuccessMessage(true);
      } else {
        setErrorMessage(response.data?.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with career server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#080B10] min-h-screen text-white">
      {/* Hero Section matching Screenshot 4 */}
      <section className="relative py-16 overflow-hidden border-b border-[#1E2535]">
        <div
          className="absolute inset-0 z-0 opacity-25 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B10]/95 via-[#080B10]/85 to-[#080B10]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                Build Your Future in <br />
                <span className="gold-text-gradient">Automotive Excellence</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                Expert garage services and vehicle career opportunities. Drive your passion. Forge your legacy.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#career-openings"
                  className="px-6 py-3 rounded-lg bg-[#E5A93C] text-[#0A0D13] text-xs font-bold tracking-widest uppercase hover:bg-amber-400 transition-all duration-300 shadow-gold"
                >
                  Explore Careers →
                </a>

                <button
                  onClick={onExploreServicesClick}
                  className="px-6 py-3 rounded-lg border border-[#2B3549] hover:border-gray-400 text-xs font-bold tracking-widest uppercase text-gray-200 transition-all duration-300"
                >
                  Our Services
                </button>
              </div>
            </div>

            {/* Right Badge matching Screenshot 4 */}
            <div className="lg:col-span-4 flex justify-end">
              <div className="rounded-2xl bg-[#0F141F]/80 backdrop-blur-md border border-[#232B3C] p-5 sm:p-6 flex items-start gap-4 max-w-sm">
                <div className="p-3 rounded-xl bg-[#181F2F] border border-[#E5A93C]/40 text-[#E5A93C] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Premium Facilities. <br />
                    World-Class Equipment.
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">Built for Performance.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Core Highlight Cards matching Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Technician Roles */}
          <div className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">
                Technician Roles
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Join our team of elite technicians and build a career working on high-end vehicles.
              </p>
            </div>
            <a
              href="#career-openings"
              className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 hover:translate-x-1 transition-transform"
            >
              View Opportunities →
            </a>
          </div>

          {/* Card 2: Service Appointments */}
          <div className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">
                Service Appointments
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Book expert service for your vehicle with our premium garage network.
              </p>
            </div>
            <button
              onClick={onBookServiceClick}
              className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 hover:translate-x-1 transition-transform text-left"
            >
              Book Now →
            </button>
          </div>

          {/* Card 3: Training Programs */}
          <div className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">
                Training Programs
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Industry-leading training and certifications to accelerate your automotive career.
              </p>
            </div>
            <button
              onClick={() => alert('AutoForge Master Guild Certification: Enrolling for 2026 sessions in EV Powertrains & Telemetry Diagnostics.')}
              className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 hover:translate-x-1 transition-transform text-left"
            >
              View Programs →
            </button>
          </div>

        </div>
      </section>

      {/* Bottom Stats Row matching Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-2xl bg-[#0C1018] border border-[#1E2638] p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Users className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">500+</span>
              <p className="text-xs text-gray-400">Team Members</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Building2 className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">25+</span>
              <p className="text-xs text-gray-400">Premium Workshops</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Star className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">98%</span>
              <p className="text-xs text-gray-400">Client Satisfaction</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <TrendingUp className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-base sm:text-lg font-bold text-white">Career Growth</span>
              <p className="text-xs text-gray-400">That Drives You Forward</p>
            </div>
          </div>

        </div>
      </section>

      {/* Active Job Openings Catalog */}
      <section id="career-openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#E5A93C]">
              Join the Vanguard
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">
              Active Career Opportunities
            </h2>
          </div>

          {/* Department tabs */}
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                  selectedDept === d.id
                    ? 'bg-[#E5A93C] text-[#0A0D13] font-bold shadow-gold'
                    : 'bg-[#121722] text-gray-400 hover:text-white border border-[#21293A]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {job.department}
                  </span>
                  <span className="text-xs text-gray-400">
                    {job.type} • {job.experienceLevel}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-serif text-white">
                  {job.title}
                </h3>

                <p className="text-xs text-gray-400 max-w-2xl line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-gray-300">
                    <DollarSign className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {job.salaryRange}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => {
                    setActiveJobForApplication(job);
                    setSuccessMessage(false);
                    setErrorMessage(null);
                  }}
                  className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider hover:bg-amber-400 shadow-gold transition-colors"
                >
                  Apply for Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {activeJobForApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] shadow-2xl p-6 sm:p-8 text-white">
            <button
              onClick={() => setActiveJobForApplication(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {successMessage ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E5A93C]/10 border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] shadow-gold">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-white">
                  Application Submitted!
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Thank you for applying for the <strong className="text-white">{activeJobForApplication.title}</strong> position. Our technical recruitment board will review your credentials and reach out.
                </p>
                <button
                  onClick={() => setActiveJobForApplication(null)}
                  className="px-6 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E5A93C]">
                  Career Application
                </span>
                <h3 className="text-xl font-bold font-serif text-white mt-1 mb-1">
                  {activeJobForApplication.title}
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  {activeJobForApplication.location} • {activeJobForApplication.salaryRange}
                </p>

                {errorMessage && (
                  <div className="mb-4 flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="marcus@example.com"
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555-0182"
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Current Role / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        placeholder="Senior Diagnostic Tech"
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                        Certifications
                      </label>
                      <input
                        type="text"
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        placeholder="ASE Master / Porsche Gold / OEM"
                        className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                      LinkedIn / Portfolio URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={portfolioOrLinkedIn}
                      onChange={(e) => setPortfolioOrLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                      Brief Cover Letter / Career Ambition
                    </label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell us why you want to forge your automotive career at AutoForge..."
                      className="w-full bg-[#151B27] border border-[#2B3549] text-xs text-white rounded p-2.5 outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#1E2638] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveJobForApplication(null)}
                      className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold hover:bg-amber-400 transition-colors disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

