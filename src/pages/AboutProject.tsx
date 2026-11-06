import React from 'react';
import {
  GraduationCap,
  Users,
  Cpu,
  Layers,
  Database,
  CheckCircle,
  FileText,
  Award,
  GitBranch,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  const teamMembers = [
    { name: 'G Mythili', rollNo: '24311A67H8', role: 'Data Analysis & Statistical Modeling' },
    { name: 'K Ashiwith', rollNo: '24311A67H6', role: 'Full-Stack & SQLite Architecture' },
    { name: 'D Niyati', rollNo: '24311A67H7', role: 'BI Dashboards & Visualization' },
  ];

  const technologies = [
    { category: 'Data Analysis & Statistics', tools: ['Python 3.10', 'Pandas', 'NumPy', 'SciPy', 'Statsmodels'] },
    { category: 'Database & Relational Engine', tools: ['SQLite 3', 'AlaSQL Engine', 'SQL DQL/DML', 'Indexed In-Memory Queries'] },
    { category: 'Visual Analytics & Dashboards', tools: ['Streamlit', 'Plotly Express', 'Matplotlib', 'Seaborn'] },
    { category: 'Interactive Web Platform', tools: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 8', 'Lucide Icons'] },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Header Banner */}
      <div className="p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#19C5E8] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Capstone Project · CSE Data Science</span>
        </div>
        <h2 className="text-xl font-bold text-[#F5F7FA]">
          CUSTOMER CHURN ANALYSIS AND BUSINESS INTELLIGENCE DASHBOARD
        </h2>
        <p className="text-xs text-[#9BAFC8] leading-relaxed max-w-3xl">
          An interactive, production-grade Data Analytics & Business Intelligence platform designed to evaluate customer retention, segment risk profiles, perform statistical hypothesis tests (Chi-Square & Welch's t-test), and execute structured SQL analytics on the IBM Telco subscriber dataset.
        </p>
      </div>

      {/* Team Details & College Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Team Members */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
          <div className="flex items-center justify-between border-b border-[#263B59] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2684FF]" />
              <h3 className="text-sm font-semibold text-[#F5F7FA]">Project Contributors & Team Members</h3>
            </div>
            <span className="text-xs font-mono text-[#19C5E8]">Batch 2024–2028</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.rollNo}
                className="p-4 rounded-xl bg-[#0B1830] border border-[#263B59] space-y-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#2684FF]/20 border border-[#2684FF]/40 flex items-center justify-center text-[#19C5E8] font-mono text-xs font-bold mb-2">
                  {member.name.slice(0, 2)}
                </div>
                <h4 className="text-xs font-bold text-[#F5F7FA]">{member.name}</h4>
                <div className="text-[11px] font-mono text-[#19C5E8] font-semibold">{member.rollNo}</div>
                <div className="text-[10px] text-[#9BAFC8] pt-1">{member.role}</div>
              </div>
            ))}
          </div>

          {/* Academic Institution Card */}
          <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1 text-xs">
            <div className="font-semibold text-[#F5F7FA]">Sreenidhi Institute of Science and Technology (SNIST)</div>
            <div className="text-[#9BAFC8]">
              Department of Computer Science and Engineering — <strong className="text-[#19C5E8]">Data Science (CSE-DS)</strong>
            </div>
            <div className="text-[11px] text-[#9BAFC8] pt-1">
              Yamnampet, Ghatkesar, Hyderabad, Telangana 501301 · Autonomous Institution affiliated to JNTUH
            </div>
          </div>
        </div>

        {/* Right: Project Objectives */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#263B59] pb-3">
            <Award className="w-4 h-4 text-[#19C5E8]" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Core Project Objectives</h3>
          </div>

          <ul className="space-y-2.5 text-xs text-[#9BAFC8]">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F7FA]">Understand Churn Drivers:</strong> Uncover the root operational and financial causes behind subscriber cancellations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F7FA]">Statistical Hypothesis Validation:</strong> Execute rigorous Chi-Square independence and Welch's t-test evaluations on actual dataset distributions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F7FA]">Relational SQL Investigations:</strong> Answer 10 core business intelligence questions using structured SQLite queries.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F7FA]">Retention Strategy Design:</strong> Deliver 6 concrete, data-backed operational actions with estimated ROI.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
        <div className="flex items-center justify-between border-b border-[#263B59] pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#2684FF]" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">End-to-End System Architecture</h3>
          </div>
          <span className="text-xs font-mono text-[#9BAFC8]">Pipeline: Ingestion → SQL → BI</span>
        </div>

        {/* Visual Architecture Pipeline Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1.5">
            <div className="font-mono text-[10px] uppercase text-[#19C5E8] font-bold">Step 01 · Data Ingestion</div>
            <div className="font-semibold text-[#F5F7FA]">IBM Telco Churn CSV</div>
            <p className="text-[11px] text-[#9BAFC8]">
              7,043 subscriber records, 21 attributes. Automatic schema check, blank TotalCharges imputation.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1.5">
            <div className="font-mono text-[10px] uppercase text-[#2684FF] font-bold">Step 02 · Processing</div>
            <div className="font-semibold text-[#F5F7FA]">Data Cleaning & Database</div>
            <p className="text-[11px] text-[#9BAFC8]">
              Tukey IQR outlier detection, duplicate eradication, SQLite relational schema generation.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1.5">
            <div className="font-mono text-[10px] uppercase text-[#19C5E8] font-bold">Step 03 · Analytics Engine</div>
            <div className="font-semibold text-[#F5F7FA]">Statistics & SQL Queries</div>
            <p className="text-[11px] text-[#9BAFC8]">
              Pearson r correlation, Chi-Square test, Welch's t-test, and 10 executive business questions.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1.5">
            <div className="font-mono text-[10px] uppercase text-emerald-400 font-bold">Step 04 · Presentation</div>
            <div className="font-semibold text-[#F5F7FA]">Interactive BI Dashboard</div>
            <p className="text-[11px] text-[#9BAFC8]">
              High-density KPIs, interactive charts, dynamic global filters, customer explorer, and export.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#263B59] pb-3">
          <Cpu className="w-4 h-4 text-[#19C5E8]" />
          <h3 className="text-sm font-semibold text-[#F5F7FA]">Technology Stack & Tooling</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {technologies.map((tech) => (
            <div key={tech.category} className="p-4 rounded-xl bg-[#0B1830] border border-[#263B59] space-y-2">
              <h4 className="text-xs font-bold text-[#F5F7FA] font-sans">{tech.category}</h4>
              <ul className="space-y-1 font-mono text-[11px] text-[#9BAFC8]">
                {tech.tools.map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#19C5E8]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
