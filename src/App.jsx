import React, { useState, useEffect, createContext, useContext } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Calendar, Users, CheckSquare, Menu, X, Plus, Edit2, Trash2, Save, Send, Star, HelpCircle, AlertCircle, Clock, FileText, Briefcase, Theater, FolderOpen } from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

const EI_SCALE = [
  { value: 1, label: 'Reactive', desc: 'I operated on autopilot, was defensive, or was overwhelmed by emotions.' },
  { value: 2, label: 'Aware', desc: 'I recognized emotions but struggled to manage them effectively.' },
  { value: 3, label: 'Managed', desc: 'I identified my emotions and began to regulate my responses.' },
  { value: 4, label: 'Adaptive', desc: 'I effectively managed emotions with empathy and skill.' },
  { value: 5, label: 'Empowering', desc: 'I used emotional understanding to foster connection and motivate.' }
];

const PS_SCALE = [
  { value: 1, label: 'Unsafe', desc: 'Fear prevented candid communication.' },
  { value: 2, label: 'Conditional', desc: 'Safety was tentative and risky.' },
  { value: 3, label: 'Neutral', desc: 'No overt fear, but no active encouragement.' },
  { value: 4, label: 'Supported', desc: 'I actively invited input and ideas.' },
  { value: 5, label: 'Generative', desc: 'Fully safe space for mistakes and conflict.' }
];

const MOOD_SCALE = [
  { value: 1, label: 'Drained', desc: 'Exhausted, depleted, struggling to engage.' },
  { value: 2, label: 'Low', desc: 'Below baseline, somewhat disconnected.' },
  { value: 3, label: 'Steady', desc: 'Balanced, neither energized nor depleted.' },
  { value: 4, label: 'Energized', desc: 'Alert, engaged, ready to contribute.' },
  { value: 5, label: 'Inspired', desc: 'Highly motivated and creative.' }
];

// ============================================================================
// CONTEXT
// ============================================================================

const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppContext.Provider');
  }
  return context;
};

// ============================================================================
// DATA INITIALIZATION
// ============================================================================

const initializeData = async () => {
  try {
    const stored = await window.storage.get('ami_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return {
    user: null,
    activeRole: 'ED',
    customRoles: [],
    employees: [],
    employeeGroups: [],
    todos: [],
    meetings: [],
    contacts: [],
    journalEntries: [],
    metrics: [],
    rehearsalReports: [],
    productions: [],
    castCrew: [],
    projectEvents: [],
    resources: [
      {
        id: 1,
        title: 'The Five Dysfunctions of a Team by Patrick Lencioni',
        url: 'https://www.tablegroup.com/books/dysfunctions',
        category: 'EI & PS',
        favorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Psychological Safety and Learning Behavior in Work Teams',
        url: 'https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf',
        category: 'EI & PS',
        favorite: false,
        createdAt: new Date().toISOString()
      }
    ]
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isPastMeeting = (meeting) => {
  return new Date(`${meeting.date}T${meeting.time || '00:00'}`) < new Date();
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent': return 'text-red-400 bg-red-900/30';
    case 'High': return 'text-orange-400 bg-orange-900/30';
    case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
    case 'Low': return 'text-slate-400 bg-slate-700/30';
    default: return 'text-slate-400 bg-slate-700/30';
  }
};

// ============================================================================
// SECTION 1 COMPLETE - Continue with App component in next section
// ============================================================================

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App = () => {
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const initialData = await initializeData();
      setData(initialData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      try {
        window.storage.set('ami_data', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-amber-300 text-xl">Loading A.M.I...</div>
      </div>
    );
  }

  if (!data.user) {
    return <LoginPage data={data} setData={setData} />;
  }

  return (
    <AppContext.Provider value={{ data, setData, currentView, setCurrentView }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          showRoleModal={showRoleModal}
          setShowRoleModal={setShowRoleModal}
        />
        
        {showRoleModal && <RoleModal onClose={() => setShowRoleModal(false)} />}
        
        <main className="container mx-auto px-4 py-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'ed' && <ExecutiveDirectorModule />}
          {currentView === 'play' && <PlayDirectorModule />}
          {currentView === 'project' && <ProjectLeadModule />}
          {currentView === 'custom' && <CustomRole />}
          {currentView === 'journal' && <Journal />}
          {currentView === 'resources' && <Resources />}
        </main>
      </div>
    </AppContext.Provider>
  );
};

// ============================================================================
// LOGIN PAGE
// ============================================================================

const LoginPage = ({ data, setData }) => {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setData({
      ...data,
      user: {
        name: name.trim(),
        organization: organization.trim(),
        createdAt: new Date().toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-amber-900/20 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <svg width="64" height="64" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M 40 160 L 100 40 L 160 160 L 130 160 L 100 90 L 70 160 Z" fill="url(#logoGradient)" />
            <path d="M 100 40 Q 140 60 160 100 Q 140 140 100 160" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <circle cx="165" cy="100" r="6" fill="#fbbf24" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-serif text-amber-300 text-center mb-2">Welcome to A.M.I.</h1>
        <p className="text-slate-400 text-center mb-6">Arts Management Insights</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 mb-2">Organization (Optional)</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              placeholder="Enter your organization"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-600 text-slate-900 px-4 py-3 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// ROLE MODAL
// ============================================================================

const RoleModal = ({ onClose }) => {
  const { data, setData } = useApp();
  const [roleName, setRoleName] = useState('');
  const [features, setFeatures] = useState({
    employees: false,
    groups: false,
    todos: false,
    meetings: false,
    contacts: false
  });

  const handleCreate = () => {
    if (!roleName.trim()) return;
    
    const selectedFeatures = Object.keys(features).filter(key => features[key]);
    if (selectedFeatures.length === 0) return;

    const newRole = {
      id: `custom_${Date.now()}`,
      name: roleName.trim(),
      type: 'custom',
      features: selectedFeatures
    };

    setData({
      ...data,
      customRoles: [...data.customRoles, newRole]
    });

    setRoleName('');
    setFeatures({
      employees: false,
      groups: false,
      todos: false,
      meetings: false,
      contacts: false
    });
  };

  const handleDelete = (roleId) => {
    if (window.confirm('Delete this custom role?')) {
      setData({
        ...data,
        customRoles: data.customRoles.filter(r => r.id !== roleId),
        activeRole: data.activeRole === roleId ? 'ED' : data.activeRole
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-amber-900/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-amber-300">Manage Custom Roles</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h3 className="text-lg text-slate-200 mb-4">Create New Role</h3>
              
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Role name"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none mb-4"
              />

              <div className="space-y-2 mb-4">
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={features.employees}
                    onChange={(e) => setFeatures({ ...features, employees: e.target.checked })}
                    className="rounded"
                  />
                  <span>Team Catalogue</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={features.groups}
                    onChange={(e) => setFeatures({ ...features, groups: e.target.checked })}
                    className="rounded"
                  />
                  <span>Groups System</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={features.todos}
                    onChange={(e) => setFeatures({ ...features, todos: e.target.checked })}
                    className="rounded"
                  />
                  <span>To-Do List</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={features.meetings}
                    onChange={(e) => setFeatures({ ...features, meetings: e.target.checked })}
                    className="rounded"
                  />
                  <span>Meetings</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={features.contacts}
                    onChange={(e) => setFeatures({ ...features, contacts: e.target.checked })}
                    className="rounded"
                  />
                  <span>Contacts</span>
                </label>
              </div>

              <button
                onClick={handleCreate}
                className="bg-amber-600 text-slate-900 px-4 py-2 rounded-lg hover:bg-amber-500 font-semibold transition-all"
              >
                Create Role
              </button>
            </div>

            {data.customRoles.length > 0 && (
              <div>
                <h3 className="text-lg text-slate-200 mb-4">Existing Custom Roles</h3>
                <div className="space-y-3">
                  {data.customRoles.map(role => (
                    <div key={role.id} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="text-slate-100 font-semibold mb-2">{role.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {role.features.includes('employees') && (
                            <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">Team Catalogue</span>
                          )}
                          {role.features.includes('groups') && (
                            <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">Groups</span>
                          )}
                          {role.features.includes('todos') && (
                            <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">To-Dos</span>
                          )}
                          {role.features.includes('meetings') && (
                            <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">Meetings</span>
                          )}
                          {role.features.includes('contacts') && (
                            <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">Contacts</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 2 COMPLETE - Continue with Header in next section
// ============================================================================

// ============================================================================
// HEADER
// ============================================================================

const Header = ({ mobileMenuOpen, setMobileMenuOpen, showRoleModal, setShowRoleModal }) => {
  const { data, setData, setCurrentView } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleRoleSwitch = (role) => {
    setData({ ...data, activeRole: role });
    if (role === 'ED') setCurrentView('ed');
    else if (role === 'Play') setCurrentView('play');
    else if (role === 'Project') setCurrentView('project');
    else setCurrentView('custom');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setData({ ...data, user: null });
    }
  };

  return (
    <header className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-amber-900/30 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <svg width="40" height="40" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M 40 160 L 100 40 L 160 160 L 130 160 L 100 90 L 70 160 Z" fill="url(#logoGradient)" />
              <path d="M 100 40 Q 140 60 160 100 Q 140 140 100 160" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
              <circle cx="165" cy="100" r="6" fill="#fbbf24" />
            </svg>
            <div>
              <h1 className="text-xl font-serif text-amber-300">A.M.I.</h1>
              <p className="text-xs text-slate-400">Arts Management Insights</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => handleRoleSwitch('ED')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'ED' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Briefcase size={18} />
              <span>Executive Director</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('Play')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'Play' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Theater size={18} />
              <span>Play Director</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('Project')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'Project' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FolderOpen size={18} />
              <span>Project Lead</span>
            </button>
            
            {data.customRoles.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleSwitch(role.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  data.activeRole === role.id ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Users size={18} />
                <span>{role.name}</span>
              </button>
            ))}
            
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
            >
              <Plus size={18} />
              <span>Manage Roles</span>
            </button>
          </nav>

          {/* Secondary Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-slate-300 hover:text-amber-300 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('journal')}
              className="text-slate-300 hover:text-amber-300 transition-colors"
            >
              Journal
            </button>
            <button
              onClick={() => setCurrentView('resources')}
              className="text-slate-300 hover:text-amber-300 transition-colors"
            >
              Resources
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Users size={18} className="text-amber-300" />
                <span className="text-slate-300">{data.user.name}</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg border border-amber-900/20 shadow-xl">
                  <div className="p-4 border-b border-slate-700">
                    <p className="text-slate-100 font-semibold">{data.user.name}</p>
                    {data.user.organization && (
                      <p className="text-slate-400 text-sm">{data.user.organization}</p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <button
              onClick={() => handleRoleSwitch('ED')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'ED' ? 'bg-amber-600 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Briefcase size={18} />
              <span>Executive Director</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('Play')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'Play' ? 'bg-amber-600 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Theater size={18} />
              <span>Play Director</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('Project')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                data.activeRole === 'Project' ? 'bg-amber-600 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <FolderOpen size={18} />
              <span>Project Lead</span>
            </button>
            
            {data.customRoles.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleSwitch(role.id)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  data.activeRole === role.id ? 'bg-amber-600 text-slate-900' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Users size={18} />
                <span>{role.name}</span>
              </button>
            ))}
            
            <button
              onClick={() => {
                setShowRoleModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300"
            >
              <Plus size={18} />
              <span>Manage Roles</span>
            </button>
            
            <div className="border-t border-slate-700 pt-2 mt-2">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentView('journal');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              >
                Journal
              </button>
              <button
                onClick={() => {
                  setCurrentView('resources');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              >
                Resources
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// SECTION 3 COMPLETE - Continue with GaugeChart and Dashboard in next section
// ============================================================================

// ============================================================================
// GAUGE CHART
// ============================================================================

const GaugeChart = ({ value, label }) => {
  const percentage = (value / 5) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  let status = 'Needs Focus';
  let statusColor = '#ef4444';
  
  if (value >= 4) {
    status = 'Strong';
    statusColor = '#22c55e';
  } else if (value >= 3) {
    status = 'Developing';
    statusColor = '#eab308';
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">{label}</h3>
      <div className="relative w-48 h-24 mx-auto mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#334155"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={statusColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 1000`}
          />
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 90)`}
          />
          <circle cx="100" cy="90" r="8" fill="#f59e0b" />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-amber-300 mb-1">{value.toFixed(1)}/5</div>
        <div className="text-sm" style={{ color: statusColor }}>{status}</div>
      </div>
    </div>
  );
};

// ============================================================================
// RATING SCALE COMPONENT
// ============================================================================

const RatingScale = ({ label, value, onChange, scale }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const currentItem = scale.find(item => item.value === value) || scale[2];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 font-medium">
          {label}: {value} - {currentItem.label}
        </label>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-amber-400 hover:text-amber-300"
            type="button"
          >
            <HelpCircle size={18} />
          </button>
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-80 bg-slate-900 border border-amber-900/30 rounded-lg p-4 shadow-xl z-10">
              {scale.map(item => (
                <div key={item.value} className="mb-3 last:mb-0">
                  <div className="text-amber-300 font-semibold">{item.value}. {item.label}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      <p className="text-slate-400 text-sm">{currentItem.desc}</p>
    </div>
  );
};

// ============================================================================
// DASHBOARD
// ============================================================================

const Dashboard = () => {
  const { data } = useApp();
  
  const roleMetrics = data.metrics.filter(m => m.role === data.activeRole);
  const avgEI = roleMetrics.length > 0
    ? roleMetrics.reduce((sum, m) => sum + m.ei_rating, 0) / roleMetrics.length
    : 0;
  const avgPS = roleMetrics.length > 0
    ? roleMetrics.reduce((sum, m) => sum + m.psych_safety_rating, 0) / roleMetrics.length
    : 0;

  const last30Days = roleMetrics
    .filter(m => {
      const metricDate = new Date(m.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return metricDate >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      EI: m.ei_rating,
      PS: m.psych_safety_rating
    }));

  const upcomingMeetings = data.meetings
    .filter(m => !isPastMeeting(m))
    .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`))
    .slice(0, 5);

  const activeCustomRole = data.customRoles.find(r => r.id === data.activeRole);
  let roleName = 'Executive Director';
  if (data.activeRole === 'Play') roleName = 'Play Director';
  else if (data.activeRole === 'Project') roleName = 'Project Lead';
  else if (activeCustomRole) roleName = activeCustomRole.name;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-amber-900/20">
        <h1 className="text-4xl font-serif text-amber-300 mb-2">
          {getGreeting()}, {data.user.name}
        </h1>
        <p className="text-slate-300 text-lg">
          Active Role: <span className="text-amber-200">{roleName}</span>
        </p>
      </div>

      {/* Leadership Metrics */}
      {roleMetrics.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-amber-300 mb-4">Leadership Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <GaugeChart value={avgEI} label="Emotional Intelligence" />
            <GaugeChart value={avgPS} label="Psychological Safety" />
          </div>
        </div>
      )}

      {/* 30-Day Trends */}
      {last30Days.length >= 2 && (
        <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">30-Day Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis domain={[1, 5]} stroke="#94a3b8" />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #d97706' }}
              />
              <Legend />
              <Line type="monotone" dataKey="EI" stroke="#f59e0b" strokeWidth={2} name="Emotional Intelligence" />
              <Line type="monotone" dataKey="PS" stroke="#22c55e" strokeWidth={2} name="Psychological Safety" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">Upcoming Meetings</h2>
          <div className="space-y-3">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg">
                <Clock className="text-amber-400" size={20} />
                <div>
                  <p className="text-slate-100 font-medium">{meeting.title}</p>
                  <p className="text-slate-400 text-sm">
                    {formatDate(meeting.date)} {meeting.time && `at ${meeting.time}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div>
        <h2 className="text-2xl font-serif text-amber-300 mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {}}
            className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20 hover:border-amber-600 transition-all text-left"
          >
            <FileText className="text-amber-400 mb-3" size={32} />
            <h3 className="text-slate-100 font-semibold text-lg mb-2">Journal</h3>
            <p className="text-slate-400 text-sm">Reflect on your leadership journey</p>
          </button>
          <button
            onClick={() => {}}
            className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20 hover:border-amber-600 transition-all text-left"
          >
            <Users className="text-amber-400 mb-3" size={32} />
            <h3 className="text-slate-100 font-semibold text-lg mb-2">Team</h3>
            <p className="text-slate-400 text-sm">Manage your team and connections</p>
          </button>
          <button
            onClick={() => {}}
            className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20 hover:border-amber-600 transition-all text-left"
          >
            <CheckSquare className="text-amber-400 mb-3" size={32} />
            <h3 className="text-slate-100 font-semibold text-lg mb-2">Tasks</h3>
            <p className="text-slate-400 text-sm">Stay on top of your to-dos</p>
          </button>
        </div>
      </div>
    </div>
  );
};



// ============================================================================
// EXECUTIVE DIRECTOR MODULE - Main Container
// ============================================================================

const ExecutiveDirectorModule = () => {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <div className="flex items-center space-x-3 mb-2">
          <Briefcase className="text-amber-400" size={32} />
          <h1 className="text-3xl font-serif text-amber-300">Executive Director</h1>
        </div>
        <p className="text-slate-400">
          Manage your organization's strategic operations, team, and key initiatives.
        </p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'employees' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Employee Catalogue
        </button>
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'todos' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          To-Do Manager
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'meetings' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Meeting Planning
        </button>
      </div>

      {activeTab === 'employees' && <EmployeeCatalogue />}
      {activeTab === 'todos' && <TodoManager />}
      {activeTab === 'meetings' && <MeetingPlanning />}
    </div>
  );
};

// ============================================================================
// EMPLOYEE CATALOGUE
// ============================================================================

const EmployeeCatalogue = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    startDate: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setData({
        ...data,
        employees: data.employees.map(emp =>
          emp.id === editingId ? { ...emp, ...formData } : emp
        )
      });
      setEditingId(null);
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setData({
        ...data,
        employees: [...data.employees, newEmployee]
      });
    }

    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      startDate: '',
      notes: ''
    });
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      startDate: employee.startDate,
      notes: employee.notes
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      setData({
        ...data,
        employees: data.employees.filter(emp => emp.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          {editingId ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Position/Title</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
            >
              {editingId ? 'Update Employee' : 'Add Employee'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    position: '',
                    department: '',
                    email: '',
                    phone: '',
                    startDate: '',
                    notes: ''
                  });
                }}
                className="bg-slate-700 text-slate-300 px-6 py-2 rounded-lg hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {data.employees.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No employees yet. Add your first one above!
          </p>
        ) : (
          data.employees.map(employee => (
            <div key={employee.id} className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">{employee.name}</h3>
                  {employee.position && (
                    <p className="text-amber-300">{employee.position}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {employee.department && (
                  <div>
                    <span className="text-slate-400">Department:</span>
                    <span className="text-slate-200 ml-2">{employee.department}</span>
                  </div>
                )}
                {employee.email && (
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200 ml-2">{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-200 ml-2">{employee.phone}</span>
                  </div>
                )}
                {employee.startDate && (
                  <div>
                    <span className="text-slate-400">Start Date:</span>
                    <span className="text-slate-200 ml-2">{formatDate(employee.startDate)}</span>
                  </div>
                )}
              </div>
              {employee.notes && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-slate-300">{employee.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};


// ============================================================================
// TODO MANAGER
// ============================================================================

const TodoManager = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    text: '',
    category: 'General',
    priority: 'Medium',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    const newTodo = {
      id: Date.now(),
      ...formData,
      status: 'Not Started',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      todos: [...data.todos, newTodo]
    });

    setFormData({
      text: '',
      category: 'General',
      priority: 'Medium',
      dueDate: ''
    });
  };

  const handleStatusChange = (id, status) => {
    setData({
      ...data,
      todos: data.todos.map(todo =>
        todo.id === id ? { ...todo, status, completed: status === 'Completed' } : todo
      )
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      setData({
        ...data,
        todos: data.todos.filter(todo => todo.id !== id)
      });
    }
  };

  const activeTodos = data.todos.filter(t => !t.completed);
  const completedTodos = data.todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Task Description *</label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              placeholder="What needs to be done?"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option>General</option>
                <option>Strategic</option>
                <option>Financial</option>
                <option>HR</option>
                <option>Fundraising</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Add Task
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Active Tasks</h2>
        {activeTodos.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No active tasks. Add one above!
          </p>
        ) : (
          <div className="space-y-3">
            {activeTodos.map(todo => (
              <div key={todo.id} className="bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-amber-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {todo.category}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-300">
                          Due: {formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-100 mb-2">{todo.text}</p>
                    <select
                      value={todo.status}
                      onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Completed Tasks</h2>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <div key={todo.id} className="bg-slate-800/30 backdrop-blur p-4 rounded-xl border border-green-900/20 opacity-75">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-300">
                        ✓ Completed
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {todo.category}
                      </span>
                    </div>
                    <p className="text-slate-300 line-through">{todo.text}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MEETING PLANNING
// ============================================================================

const MeetingPlanning = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    attendees: '',
    agenda: '',
    preMeetingNotes: ''
  });
  const [expandedId, setExpandedId] = useState(null);
  const [reflectionData, setReflectionData] = useState({});
  const [actionItemsData, setActionItemsData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const newMeeting = {
      id: Date.now(),
      ...formData,
      postMeetingReflection: '',
      actionItems: '',
      notes: '',
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      meetings: [...data.meetings, newMeeting]
    });

    setFormData({
      title: '',
      date: '',
      time: '',
      attendees: '',
      agenda: '',
      preMeetingNotes: ''
    });
  };

  const handleUpdateReflection = (id) => {
    setData({
      ...data,
      meetings: data.meetings.map(meeting =>
        meeting.id === id
          ? {
              ...meeting,
              postMeetingReflection: reflectionData[id] || '',
              actionItems: actionItemsData[id] || ''
            }
          : meeting
      )
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this meeting?')) {
      setData({
        ...data,
        meetings: data.meetings.filter(meeting => meeting.id !== id)
      });
    }
  };

  const sortedMeetings = [...data.meetings].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Schedule New Meeting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-slate-300 mb-2">Meeting Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g., Board Meeting, Staff Check-in"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-slate-300 mb-2">Attendees</label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="Comma-separated"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Agenda</label>
            <textarea
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              placeholder="What will be discussed?"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Pre-Meeting Preparation Notes</label>
            <textarea
              value={formData.preMeetingNotes}
              onChange={(e) => setFormData({ ...formData, preMeetingNotes: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              placeholder="What do you need to prepare?"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Schedule Meeting
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {sortedMeetings.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No meetings scheduled yet. Add one above!
          </p>
        ) : (
          sortedMeetings.map(meeting => {
            const isPast = isPastMeeting(meeting);
            const isExpanded = expandedId === meeting.id;

            return (
              <div key={meeting.id} className="bg-slate-800/50 backdrop-blur rounded-xl border border-amber-900/20 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : meeting.id)}
                  className="w-full p-6 text-left hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-100 mb-1">{meeting.title}</h3>
                      <div className="flex items-center space-x-4 text-slate-400">
                        <span>{formatDate(meeting.date)}</span>
                        {meeting.time && <span>{meeting.time}</span>}
                        <span className={`text-xs px-2 py-1 rounded ${
                          isPast ? 'bg-slate-700 text-slate-300' : 'bg-blue-900/30 text-blue-300'
                        }`}>
                          {isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(meeting.id);
                      }}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4 border-t border-slate-700">
                    {meeting.agenda && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-2 mt-4">Agenda</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{meeting.agenda}</p>
                      </div>
                    )}
                    {meeting.preMeetingNotes && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-2">Pre-Meeting Notes</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{meeting.preMeetingNotes}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-2">Post-Meeting Reflection</h4>
                      <textarea
                        value={reflectionData[meeting.id] !== undefined ? reflectionData[meeting.id] : meeting.postMeetingReflection}
                        onChange={(e) => setReflectionData({ ...reflectionData, [meeting.id]: e.target.value })}
                        rows="4"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                        placeholder="How did the meeting go? What insights did you gain?"
                      />
                    </div>
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-2">Action Items</h4>
                      <textarea
                        value={actionItemsData[meeting.id] !== undefined ? actionItemsData[meeting.id] : meeting.actionItems}
                        onChange={(e) => setActionItemsData({ ...actionItemsData, [meeting.id]: e.target.value })}
                        rows="4"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                        placeholder="What needs to be done? Who is responsible?"
                      />
                    </div>
                    <button
                      onClick={() => handleUpdateReflection(meeting.id)}
                      className="bg-amber-600 text-slate-900 px-4 py-2 rounded-lg hover:bg-amber-500 font-semibold transition-all"
                    >
                      <Save size={18} className="inline mr-2" />
                      Save Updates
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Continue with Play Director, Project Lead, and other modules...
// ============================================================================

// ============================================================================
// PLAY DIRECTOR MODULE
// ============================================================================

const PlayDirectorModule = () => {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <div className="flex items-center space-x-3 mb-2">
          <Theater className="text-amber-400" size={32} />
          <h1 className="text-3xl font-serif text-amber-300">Play Director</h1>
        </div>
        <p className="text-slate-400">
          Manage rehearsals, track progress, and organize your production team.
        </p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'reports' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Rehearsal Reports
        </button>
        <button
          onClick={() => setActiveTab('productions')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'productions' ? 'bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Production Management
        </button>
      </div>

      {activeTab === 'reports' && <RehearsalReports />}
      {activeTab === 'productions' && <ProductionManagement />}
    </div>
  );
};

// ============================================================================
// REHEARSAL REPORTS
// ============================================================================

const RehearsalReports = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    production: '',
    date: '',
    startTime: '',
    endTime: '',
    scenesWorked: '',
    attendees: '',
    absentees: '',
    accomplishments: '',
    challenges: '',
    notesForNextTime: '',
    safetyIncidents: '',
    morale: 3
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.production.trim() || !formData.date) return;

    const newReport = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      rehearsalReports: [...data.rehearsalReports, newReport]
    });

    setFormData({
      production: '',
      date: '',
      startTime: '',
      endTime: '',
      scenesWorked: '',
      attendees: '',
      absentees: '',
      accomplishments: '',
      challenges: '',
      notesForNextTime: '',
      safetyIncidents: '',
      morale: 3
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this rehearsal report?')) {
      setData({
        ...data,
        rehearsalReports: data.rehearsalReports.filter(report => report.id !== id)
      });
    }
  };

  const sortedReports = [...data.rehearsalReports].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">New Rehearsal Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-2">Production Name *</label>
              <input
                type="text"
                value={formData.production}
                onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Scenes/Acts Worked On</label>
              <input
                type="text"
                value={formData.scenesWorked}
                onChange={(e) => setFormData({ ...formData, scenesWorked: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g., Act 1 Scene 3, Act 2 Scene 1"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Who was present?</label>
            <textarea
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Who was absent?</label>
            <textarea
              value={formData.absentees}
              onChange={(e) => setFormData({ ...formData, absentees: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">What went well? Accomplishments</label>
            <textarea
              value={formData.accomplishments}
              onChange={(e) => setFormData({ ...formData, accomplishments: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Challenges or issues</label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Notes for next rehearsal</label>
            <textarea
              value={formData.notesForNextTime}
              onChange={(e) => setFormData({ ...formData, notesForNextTime: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Safety incidents or concerns?</label>
            <textarea
              value={formData.safetyIncidents}
              onChange={(e) => setFormData({ ...formData, safetyIncidents: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Overall Morale: {formData.morale}/5</label>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">Low</span>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.morale}
                onChange={(e) => setFormData({ ...formData, morale: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-slate-400 text-sm">High</span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Save Rehearsal Report
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Past Reports</h2>
        {sortedReports.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No rehearsal reports yet. Create one above!
          </p>
        ) : (
          <div className="space-y-4">
            {sortedReports.map(report => (
              <div key={report.id} className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-100 mb-1">{report.production}</h3>
                    <p className="text-slate-400">
                      {formatDate(report.date)}
                      {report.startTime && report.endTime && ` • ${report.startTime} - ${report.endTime}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {report.scenesWorked && (
                  <div className="mb-4">
                    <span className="text-slate-400">Scenes worked: </span>
                    <span className="text-slate-200">{report.scenesWorked}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {report.attendees && (
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-1">Present:</h4>
                      <p className="text-slate-400 whitespace-pre-wrap">{report.attendees}</p>
                    </div>
                  )}
                  {report.absentees && (
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-1">Absent:</h4>
                      <p className="text-slate-400 whitespace-pre-wrap">{report.absentees}</p>
                    </div>
                  )}
                  {report.accomplishments && (
                    <div className="bg-green-900/20 p-3 rounded-lg">
                      <h4 className="text-green-300 font-semibold mb-1">✓ Accomplishments:</h4>
                      <p className="text-slate-300 whitespace-pre-wrap">{report.accomplishments}</p>
                    </div>
                  )}
                  {report.challenges && (
                    <div className="bg-orange-900/20 p-3 rounded-lg">
                      <h4 className="text-orange-300 font-semibold mb-1">⚠ Challenges:</h4>
                      <p className="text-slate-300 whitespace-pre-wrap">{report.challenges}</p>
                    </div>
                  )}
                  {report.notesForNextTime && (
                    <div className="bg-amber-900/20 p-3 rounded-lg">
                      <h4 className="text-amber-300 font-semibold mb-1">→ Next Time:</h4>
                      <p className="text-slate-300 whitespace-pre-wrap">{report.notesForNextTime}</p>
                    </div>
                  )}
                  {report.safetyIncidents && (
                    <div className="bg-red-900/30 p-3 rounded-lg">
                      <h4 className="text-red-300 font-semibold mb-1">⚠ Safety:</h4>
                      <p className="text-slate-300 whitespace-pre-wrap">{report.safetyIncidents}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Morale: </span>
                    <span className="text-amber-300 font-semibold">{report.morale}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PRODUCTION MANAGEMENT
// ============================================================================

const ProductionManagement = () => {
  const { data, setData } = useApp();
  const [productionForm, setProductionForm] = useState({
    title: '',
    openingDate: '',
    closingDate: '',
    venue: ''
  });
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [castCrewForm, setCastCrewForm] = useState({
    name: '',
    role: '',
    type: 'Cast',
    contact: '',
    notes: ''
  });

  const handleCreateProduction = (e) => {
    e.preventDefault();
    if (!productionForm.title.trim()) return;

    const newProduction = {
      id: Date.now(),
      ...productionForm,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      productions: [...data.productions, newProduction]
    });

    setProductionForm({
      title: '',
      openingDate: '',
      closingDate: '',
      venue: ''
    });
  };

  const handleDeleteProduction = (id) => {
    if (window.confirm('Delete this production and all associated cast/crew?')) {
      setData({
        ...data,
        productions: data.productions.filter(p => p.id !== id),
        castCrew: data.castCrew.filter(cc => cc.productionId !== id)
      });
      if (selectedProduction?.id === id) {
        setSelectedProduction(null);
      }
    }
  };

  const handleAddCastCrew = (e) => {
    e.preventDefault();
    if (!castCrewForm.name.trim() || !selectedProduction) return;

    const newMember = {
      id: Date.now(),
      productionId: selectedProduction.id,
      ...castCrewForm,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      castCrew: [...data.castCrew, newMember]
    });

    setCastCrewForm({
      name: '',
      role: '',
      type: 'Cast',
      contact: '',
      notes: ''
    });
  };

  const handleDeleteCastCrew = (id) => {
    if (window.confirm('Remove this person?')) {
      setData({
        ...data,
        castCrew: data.castCrew.filter(cc => cc.id !== id)
      });
    }
  };

  const productionCastCrew = selectedProduction
    ? data.castCrew.filter(cc => cc.productionId === selectedProduction.id)
    : [];
  const cast = productionCastCrew.filter(cc => cc.type === 'Cast');
  const crew = productionCastCrew.filter(cc => cc.type === 'Crew');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Create Production</h2>
        <form onSubmit={handleCreateProduction} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Production Title *</label>
              <input
                type="text"
                value={productionForm.title}
                onChange={(e) => setProductionForm({ ...productionForm, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Opening Date</label>
              <input
                type="date"
                value={productionForm.openingDate}
                onChange={(e) => setProductionForm({ ...productionForm, openingDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Closing Date</label>
              <input
                type="date"
                value={productionForm.closingDate}
                onChange={(e) => setProductionForm({ ...productionForm, closingDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Venue</label>
              <input
                type="text"
                value={productionForm.venue}
                onChange={(e) => setProductionForm({ ...productionForm, venue: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Create Production
          </button>
        </form>
      </div>

      {data.productions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Productions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.productions.map(production => (
              <button
                key={production.id}
                onClick={() => setSelectedProduction(production)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedProduction?.id === production.id
                    ? 'bg-amber-900/20 border-amber-600'
                    : 'bg-slate-800/50 border-amber-900/20 hover:border-amber-600/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-slate-100">{production.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduction(production.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {production.openingDate && (
                  <p className="text-slate-400 text-sm">
                    Opens: {formatDate(production.openingDate)}
                  </p>
                )}
                {production.venue && (
                  <p className="text-slate-400 text-sm">{production.venue}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProduction && (
        <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
          <h2 className="text-2xl font-serif text-amber-300 mb-6">
            Cast & Crew: {selectedProduction.title}
          </h2>

          <form onSubmit={handleAddCastCrew} className="mb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={castCrewForm.name}
                  onChange={(e) => setCastCrewForm({ ...castCrewForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Role/Position</label>
                <input
                  type="text"
                  value={castCrewForm.role}
                  onChange={(e) => setCastCrewForm({ ...castCrewForm, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Type</label>
                <select
                  value={castCrewForm.type}
                  onChange={(e) => setCastCrewForm({ ...castCrewForm, type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  <option>Cast</option>
                  <option>Crew</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Contact Info</label>
                <input
                  type="text"
                  value={castCrewForm.contact}
                  onChange={(e) => setCastCrewForm({ ...castCrewForm, contact: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-300 mb-2">Notes (conflicts, special requirements, etc.)</label>
                <textarea
                  value={castCrewForm.notes}
                  onChange={(e) => setCastCrewForm({ ...castCrewForm, notes: e.target.value })}
                  rows="2"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
            >
              Add Member
            </button>
          </form>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Cast</h3>
              {cast.length === 0 ? (
                <p className="text-slate-400 text-sm">No cast members yet</p>
              ) : (
                <div className="space-y-3">
                  {cast.map(member => (
                    <div key={member.id} className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-slate-100 font-semibold">{member.name}</h4>
                          {member.role && (
                            <p className="text-amber-300 text-sm">{member.role}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCastCrew(member.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {member.contact && (
                        <p className="text-slate-400 text-sm">{member.contact}</p>
                      )}
                      {member.notes && (
                        <p className="text-slate-400 text-sm mt-2">{member.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Crew</h3>
              {crew.length === 0 ? (
                <p className="text-slate-400 text-sm">No crew members yet</p>
              ) : (
                <div className="space-y-3">
                  {crew.map(member => (
                    <div key={member.id} className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-slate-100 font-semibold">{member.name}</h4>
                          {member.role && (
                            <p className="text-amber-300 text-sm">{member.role}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCastCrew(member.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {member.contact && (
                        <p className="text-slate-400 text-sm">{member.contact}</p>
                      )}
                      {member.notes && (
                        <p className="text-slate-400 text-sm mt-2">{member.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PROJECT LEAD MODULE
// ============================================================================

const ProjectLeadModule = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Event',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'Planning',
    description: '',
    teamMembers: '',
    goals: '',
    milestones: ''
  });
  const [expandedId, setExpandedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProject = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      projectEvents: [...data.projectEvents, newProject]
    });

    setFormData({
      title: '',
      type: 'Event',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'Planning',
      description: '',
      teamMembers: '',
      goals: '',
      milestones: ''
    });
  };

  const handleStatusChange = (id, status) => {
    setData({
      ...data,
      projectEvents: data.projectEvents.map(project =>
        project.id === id ? { ...project, status } : project
      )
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) {
      setData({
        ...data,
        projectEvents: data.projectEvents.filter(project => project.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <div className="flex items-center space-x-3 mb-2">
          <FolderOpen className="text-amber-400" size={32} />
          <h1 className="text-3xl font-serif text-amber-300">Project Lead</h1>
        </div>
        <p className="text-slate-400">
          Manage events, exhibitions, workshops, and community programs.
        </p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Create New Project/Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Project/Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option>Event</option>
                <option>Exhibition</option>
                <option>Workshop</option>
                <option>Fundraiser</option>
                <option>Community Program</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g., $5,000"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Project Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Team Members (comma-separated)</label>
            <textarea
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Goals & Objectives</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Key Milestones</label>
            <textarea
              value={formData.milestones}
              onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Create Project
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {data.projectEvents.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No projects yet. Create one above!
          </p>
        ) : (
          data.projectEvents.map(project => {
            const isExpanded = expandedId === project.id;
            return (
              <div key={project.id} className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-100">{project.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-amber-900/30 text-amber-300">
                        {project.type}
                      </span>
                    </div>
                    {(project.startDate || project.endDate) && (
                      <p className="text-slate-400 text-sm mb-2">
                        {project.startDate && formatDate(project.startDate)}
                        {project.startDate && project.endDate && ' - '}
                        {project.endDate && formatDate(project.endDate)}
                      </p>
                    )}
                    {project.budget && (
                      <p className="text-slate-400 text-sm">Budget: {project.budget}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option>Planning</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                    </select>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  className="text-amber-400 hover:text-amber-300 text-sm mb-4"
                >
                  {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>

                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    {project.description && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-1">Description</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{project.description}</p>
                      </div>
                    )}
                    {project.teamMembers && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-1">Team Members</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{project.teamMembers}</p>
                      </div>
                    )}
                    {project.goals && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-1">Goals & Objectives</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{project.goals}</p>
                      </div>
                    )}
                    {project.milestones && (
                      <div>
                        <h4 className="text-slate-300 font-semibold mb-1">Key Milestones</h4>
                        <p className="text-slate-400 whitespace-pre-wrap">{project.milestones}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CUSTOM ROLE COMPONENTS
// ============================================================================

const CustomRole = () => {
  const { data } = useApp();
  const activeRole = data.customRoles.find(r => r.id === data.activeRole);

  if (!activeRole) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Custom role not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="text-amber-400" size={32} />
          <h1 className="text-3xl font-serif text-amber-300">{activeRole.name}</h1>
        </div>
        <p className="text-slate-400">Custom role workspace</p>
      </div>

      {activeRole.features.includes('employees') && <EmployeesSection />}
      {activeRole.features.includes('groups') && <GroupsSection />}
      {activeRole.features.includes('todos') && <TodosSection />}
      {activeRole.features.includes('meetings') && <MeetingsSection />}
      {activeRole.features.includes('contacts') && <ContactsSection />}
    </div>
  );
};

// ============================================================================
// EMPLOYEES SECTION (CUSTOM ROLE)
// ============================================================================

const EmployeesSection = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setData({
        ...data,
        employees: data.employees.map(emp =>
          emp.id === editingId ? { ...emp, ...formData, position: formData.role } : emp
        )
      });
      setEditingId(null);
    } else {
      const newEmployee = {
        id: Date.now(),
        name: formData.name,
        position: formData.role,
        email: formData.email,
        notes: formData.notes,
        department: '',
        phone: '',
        startDate: '',
        createdAt: new Date().toISOString()
      };
      setData({
        ...data,
        employees: [...data.employees, newEmployee]
      });
    }

    setFormData({ name: '', role: '', email: '', notes: '' });
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      role: employee.position,
      email: employee.email,
      notes: employee.notes
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this team member?')) {
      setData({
        ...data,
        employees: data.employees.filter(emp => emp.id !== id)
      });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Team Catalogue</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            {editingId ? 'Update' : 'Add'} Team Member
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', role: '', email: '', notes: '' });
              }}
              className="bg-slate-700 text-slate-300 px-6 py-2 rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {data.employees.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No team members yet</p>
        ) : (
          data.employees.map(emp => (
            <div key={emp.id} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="text-slate-100 font-semibold">{emp.name}</h3>
                {emp.position && <p className="text-amber-300 text-sm">{emp.position}</p>}
                {emp.email && <p className="text-slate-400 text-sm">{emp.email}</p>}
                {emp.notes && <p className="text-slate-400 text-sm mt-1">{emp.notes}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="text-amber-400 hover:text-amber-300"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// GROUPS SECTION (CUSTOM ROLE)
// ============================================================================

const GroupsSection = () => {
  const { data, setData } = useApp();
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: groupName.trim(),
      members: [],
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      employeeGroups: [...data.employeeGroups, newGroup]
    });

    setGroupName('');
  };

  const handleDeleteGroup = (id) => {
    if (window.confirm('Delete this group?')) {
      setData({
        ...data,
        employeeGroups: data.employeeGroups.filter(g => g.id !== id)
      });
      if (selectedGroup?.id === id) {
        setSelectedGroup(null);
      }
    }
  };

  const toggleMember = (employeeId) => {
    if (!selectedGroup) return;

    const isMember = selectedGroup.members.includes(employeeId);
    const newMembers = isMember
      ? selectedGroup.members.filter(id => id !== employeeId)
      : [...selectedGroup.members, employeeId];

    const updatedGroup = { ...selectedGroup, members: newMembers };
    setSelectedGroup(updatedGroup);

    setData({
      ...data,
      employeeGroups: data.employeeGroups.map(g =>
        g.id === selectedGroup.id ? updatedGroup : g
      )
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Groups</h2>

      <form onSubmit={handleCreateGroup} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="New group name"
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Create Group
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Groups</h3>
          {data.employeeGroups.length === 0 ? (
            <p className="text-slate-400 text-sm">No groups yet</p>
          ) : (
            <div className="space-y-2">
              {data.employeeGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedGroup?.id === group.id
                      ? 'bg-amber-900/20 border border-amber-600'
                      : 'bg-slate-900/50 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-100 font-semibold">{group.name}</p>
                      <p className="text-slate-400 text-sm">{group.members.length} members</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedGroup ? (
            <>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">
                Members of {selectedGroup.name}
              </h3>
              {data.employees.length === 0 ? (
                <p className="text-slate-400 text-sm">No team members available</p>
              ) : (
                <div className="space-y-2">
                  {data.employees.map(emp => (
                    <label key={emp.id} className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-900/70">
                      <input
                        type="checkbox"
                        checked={selectedGroup.members.includes(emp.id)}
                        onChange={() => toggleMember(emp.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-slate-100">{emp.name}</p>
                        {emp.position && <p className="text-slate-400 text-sm">{emp.position}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-sm">Select a group to manage members</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TODOS SECTION (CUSTOM ROLE)
// ============================================================================

const TodosSection = () => {
  const { data, setData } = useApp();
  const [todoText, setTodoText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todoText.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todoText.trim(),
      category: 'General',
      priority: 'Medium',
      status: 'Not Started',
      dueDate: '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      todos: [...data.todos, newTodo]
    });

    setTodoText('');
  };

  const toggleComplete = (id) => {
    setData({
      ...data,
      todos: data.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed, status: !todo.completed ? 'Completed' : 'Not Started' } : todo
      )
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      setData({
        ...data,
        todos: data.todos.filter(todo => todo.id !== id)
      });
    }
  };

  const activeTodos = data.todos.filter(t => !t.completed);
  const completedTodos = data.todos.filter(t => t.completed);

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">To-Do List</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Active</h3>
          {activeTodos.length === 0 ? (
            <p className="text-slate-400 text-sm">No active tasks</p>
          ) : (
            <div className="space-y-2">
              {activeTodos.map(todo => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleComplete(todo.id)}
                    className="rounded"
                  />
                  <p className="flex-1 text-slate-100">{todo.text}</p>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedTodos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Completed</h3>
            <div className="space-y-2">
              {completedTodos.map(todo => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 bg-slate-900/30 rounded-lg opacity-75">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleComplete(todo.id)}
                    className="rounded"
                  />
                  <p className="flex-1 text-slate-300 line-through">{todo.text}</p>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MEETINGS SECTION (CUSTOM ROLE)
// ============================================================================

const MeetingsSection = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const newMeeting = {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      attendees: '',
      agenda: '',
      preMeetingNotes: formData.notes,
      postMeetingReflection: '',
      actionItems: '',
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      meetings: [...data.meetings, newMeeting]
    });

    setFormData({ title: '', date: '', time: '', notes: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this meeting?')) {
      setData({
        ...data,
        meetings: data.meetings.filter(m => m.id !== id)
      });
    }
  };

  const sortedMeetings = [...data.meetings].sort((a, b) =>
    new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`)
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Meetings</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-slate-300 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-slate-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
        >
          Add Meeting
        </button>
      </form>

      <div className="space-y-3">
        {sortedMeetings.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No meetings scheduled</p>
        ) : (
          sortedMeetings.map(meeting => {
            const isPast = isPastMeeting(meeting);
            return (
              <div key={meeting.id} className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-slate-100 font-semibold">{meeting.title}</h3>
                    <p className="text-slate-400 text-sm">
                      {formatDate(meeting.date)} {meeting.time && `at ${meeting.time}`}
                    </p>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                      isPast ? 'bg-slate-700 text-slate-300' : 'bg-blue-900/30 text-blue-300'
                    }`}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {meeting.notes && (
                  <p className="text-slate-400 text-sm mt-2 whitespace-pre-wrap">{meeting.notes}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CONTACTS SECTION (CUSTOM ROLE)
// ============================================================================

const ContactsSection = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newContact = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      contacts: [...data.contacts, newContact]
    });

    setFormData({
      name: '',
      organization: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) {
      setData({
        ...data,
        contacts: data.contacts.filter(c => c.id !== id)
      });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Contacts</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Organization</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
        >
          Add Contact
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {data.contacts.length === 0 ? (
          <p className="text-slate-400 text-center py-8 md:col-span-2">No contacts yet</p>
        ) : (
          data.contacts.map(contact => (
            <div key={contact.id} className="bg-slate-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-slate-100 font-semibold">{contact.name}</h3>
                  {contact.organization && (
                    <p className="text-amber-300 text-sm">{contact.organization}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {contact.email && (
                <p className="text-slate-400 text-sm">{contact.email}</p>
              )}
              {contact.phone && (
                <p className="text-slate-400 text-sm">{contact.phone}</p>
              )}
              {contact.notes && (
                <p className="text-slate-400 text-sm mt-2">{contact.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// JOURNAL
// ============================================================================

const Journal = () => {
  const { data, setData } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    ei_rating: 3,
    psych_safety_rating: 3,
    mood_rating: 3
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    const now = new Date().toISOString();
    const newEntry = {
      id: Date.now(),
      ...formData,
      date: now,
      role: data.activeRole,
      createdAt: now
    };

    const newMetric = {
      id: Date.now(),
      date: now,
      ei_rating: formData.ei_rating,
      psych_safety_rating: formData.psych_safety_rating,
      mood_rating: formData.mood_rating,
      role: data.activeRole
    };

    setData({
      ...data,
      journalEntries: [...data.journalEntries, newEntry],
      metrics: [...data.metrics, newMetric]
    });

    setFormData({
      title: '',
      content: '',
      ei_rating: 3,
      psych_safety_rating: 3,
      mood_rating: 3
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this journal entry?')) {
      setData({
        ...data,
        journalEntries: data.journalEntries.filter(entry => entry.id !== id)
      });
    }
  };

  const sortedEntries = [...data.journalEntries].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-amber-300 mb-2">Leadership Journal</h1>
            <p className="text-slate-400">Reflect on your leadership journey and track your growth</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            {showForm ? 'Cancel' : 'New Entry'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">New Journal Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="Give your entry a title..."
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="8"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="What's on your mind?..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Rate Today's Experience</h3>
              
              <RatingScale
                label="Emotional Intelligence"
                value={formData.ei_rating}
                onChange={(value) => setFormData({ ...formData, ei_rating: value })}
                scale={EI_SCALE}
              />

              <RatingScale
                label="Psychological Safety"
                value={formData.psych_safety_rating}
                onChange={(value) => setFormData({ ...formData, psych_safety_rating: value })}
                scale={PS_SCALE}
              />

              <RatingScale
                label="Personal Mood"
                value={formData.mood_rating}
                onChange={(value) => setFormData({ ...formData, mood_rating: value })}
                scale={MOOD_SCALE}
              />
            </div>

            <button
              type="submit"
              className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
            >
              Save Entry
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sortedEntries.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur p-12 rounded-xl border border-amber-900/20 text-center">
            <FileText className="mx-auto mb-4 text-amber-400" size={48} />
            <p className="text-slate-400 text-lg">No journal entries yet</p>
            <p className="text-slate-500">Start reflecting on your leadership journey</p>
          </div>
        ) : (
          sortedEntries.map(entry => {
            const eiItem = EI_SCALE.find(i => i.value === entry.ei_rating);
            const psItem = PS_SCALE.find(i => i.value === entry.psych_safety_rating);
            const moodItem = MOOD_SCALE.find(i => i.value === entry.mood_rating);

            return (
              <div key={entry.id} className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {entry.title && (
                      <h3 className="text-xl font-semibold text-amber-300 mb-1">{entry.title}</h3>
                    )}
                    <p className="text-slate-400 text-sm">{formatDateTime(entry.date)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-slate-200 whitespace-pre-wrap mb-4">{entry.content}</p>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Emotional Intelligence</p>
                    <p className="text-amber-300 font-semibold">
                      {entry.ei_rating}/5 - {eiItem?.label}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Psychological Safety</p>
                    <p className="text-green-300 font-semibold">
                      {entry.psych_safety_rating}/5 - {psItem?.label}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Personal Mood</p>
                    <p className="text-blue-300 font-semibold">
                      {entry.mood_rating}/5 - {moodItem?.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// RESOURCES
// ============================================================================

const Resources = () => {
  const { data, setData } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'EI & PS'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    const newResource = {
      id: Date.now(),
      ...formData,
      favorite: false,
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      resources: [...data.resources, newResource]
    });

    setFormData({
      title: '',
      url: '',
      category: 'EI & PS'
    });
  };

  const toggleFavorite = (id) => {
    setData({
      ...data,
      resources: data.resources.map(resource =>
        resource.id === id ? { ...resource, favorite: !resource.favorite } : resource
      )
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this resource?')) {
      setData({
        ...data,
        resources: data.resources.filter(resource => resource.id !== id)
      });
    }
  };

  const favorites = data.resources.filter(r => r.favorite);
  const categories = ['EI & PS', 'Leadership', 'Arts Management', 'Team Building', 'Other'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h1 className="text-3xl font-serif text-amber-300 mb-2">Leadership Resources</h1>
        <p className="text-slate-400">Curate helpful articles, tools, and references</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Add New Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-2">Resource Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-slate-300 mb-2">URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="https://"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-slate-900 px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold shadow-lg transition-all"
          >
            Add Resource
          </button>
        </form>
      </div>

      {favorites.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
            <Star className="mr-2 text-amber-400 fill-amber-400" size={24} />
            Favorites
          </h2>
          <div className="space-y-3">
            {favorites.map(resource => (
              <div key={resource.id} className="bg-slate-900/50 p-4 rounded-lg border border-amber-600/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 font-semibold"
                    >
                      {resource.title}
                    </a>
                    <p className="text-slate-400 text-sm mt-1">{resource.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <Star size={18} className="fill-amber-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.map(category => {
        const categoryResources = data.resources.filter(r => r.category === category && !r.favorite);
        if (categoryResources.length === 0) return null;

        return (
          <div key={category} className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-amber-900/20">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">{category}</h2>
            <div className="space-y-3">
              {categoryResources.map(resource => (
                <div key={resource.id} className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 font-semibold"
                      >
                        {resource.title}
                      </a>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(resource.id)}
                        className="text-slate-400 hover:text-amber-400"
                      >
                        <Star size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default App;