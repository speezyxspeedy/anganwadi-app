'use client'

import React, { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react'

// --- Multi-language support (English, Hindi, Marathi) ---
type Lang = 'en' | 'hi' | 'mr'

const i18n = {
  en: {
    appTitle: 'Anganwadi Poshan Connect',
    appSubtitle: 'Ministry of Women & Child Development · Poshan Abhiyaan',
    centreCode: 'AWC-042',
    centreName: 'Shivaji Nagar Centre · Ward 12',
    adminRole: 'Anganwadi Worker / Sevika',
    adminName: 'Rekha Tai Patil',
    parentRole: 'Parent / Guardian',
    offlineReady: 'Offline Ready · Sync OK',
    navDashboard: 'Dashboard',
    navChildren: 'Children Register',
    navAttendance: 'Daily Attendance',
    navGrowth: 'Growth & Nutrition',
    navVaccines: 'Immunizations',
    navRation: 'Ration & Poshan',
    navImport: 'Bulk CSV Upload',
    totalChildren: 'Total Enrolled',
    presentToday: 'Present Today',
    mamCases: 'MAM (Moderate)',
    samCases: 'SAM (Severe)',
    quickActions: 'Quick Actions',
    enrollChild: 'Enroll New Child',
    markAttendance: 'Record Attendance',
    exportCsv: 'Export Records (CSV)',
    downloadTemplate: 'Sample CSV Template',
    searchPlaceholder: 'Search by child name, ID, or guardian mobile...',
    filterAll: 'All Children',
    filterNormal: 'Normal',
    filterMam: 'MAM Cases',
    filterSam: 'SAM Cases',
    filterAbsent: 'Absent Today',
    statusNormal: 'Normal',
    statusMam: 'MAM',
    statusSam: 'SAM',
    actionViewProfile: 'View Journey',
    actionUpdateGrowth: 'Update Weight/Height',
    attendanceMarkAll: 'Mark All Present',
    vaccineCompleted: 'Completed',
    vaccineDue: 'Due This Month',
    vaccineUpcoming: 'Upcoming',
    rationNextDate: 'Next Ration Distribution',
    switchAccess: 'Switch User',
    parentGreeting: 'Child Health Passport',
    poshanTipsTitle: 'Recommended Poshan Nutrition',
  },
  hi: {
    appTitle: 'आंगनवाड़ी पोषण कनेक्ट',
    appSubtitle: 'महिला एवं बाल विकास मंत्रालय · पोषण अभियान',
    centreCode: 'AWC-042',
    centreName: 'शिवाजी नगर केंद्र · प्रभाग १२',
    adminRole: 'आंगनवाड़ी कार्यकत्री / सेविका',
    adminName: 'रेखा ताई पाटिल',
    parentRole: 'अभिभावक / माता-पिता',
    offlineReady: 'ऑफलाइन उपलब्ध · सिंक सुरक्षित',
    navDashboard: 'डैशबोर्ड',
    navChildren: 'बच्चे और पंजीयन',
    navAttendance: 'दैनिक उपस्थिति',
    navGrowth: 'वृद्धि व पोषण',
    navVaccines: 'टीकाकरण (U-WIN)',
    navRation: 'राशन व पोषण आहार',
    navImport: 'थोक CSV आयात',
    totalChildren: 'कुल पंजीकृत बच्चे',
    presentToday: 'आज उपस्थित',
    mamCases: 'मध्यम कुपोषित (MAM)',
    samCases: 'अति कुपोषित (SAM)',
    quickActions: 'त्वरित कार्य',
    enrollChild: 'नया बच्चा जोड़ें',
    markAttendance: 'उपस्थिति दर्ज करें',
    exportCsv: 'डेटा निर्यात (CSV)',
    downloadTemplate: 'नमूना CSV फ़ाइल',
    searchPlaceholder: 'बच्चे का नाम, आईडी या मोबाइल खोजें...',
    filterAll: 'सभी बच्चे',
    filterNormal: 'सामान्य',
    filterMam: 'MAM बच्चे',
    filterSam: 'SAM बच्चे',
    filterAbsent: 'आज अनुपस्थित',
    statusNormal: 'सामान्य',
    statusMam: 'मध्यम कुपोषित',
    statusSam: 'अति कुपोषित',
    actionViewProfile: 'प्रोफाइल देखें',
    actionUpdateGrowth: 'वजन व ऊंचाई दर्ज करें',
    attendanceMarkAll: 'सभी को उपस्थित करें',
    vaccineCompleted: 'पूर्ण',
    vaccineDue: 'इस माह देय',
    vaccineUpcoming: 'आगामी',
    rationNextDate: 'अगला राशन वितरण',
    switchAccess: 'उपयोगकर्ता बदलें',
    parentGreeting: 'बाल स्वास्थ्य पासपोर्ट',
    poshanTipsTitle: 'पोषण युक्त आहार सलाह',
  },
  mr: {
    appTitle: 'अंगणवाडी पोषण कनेक्ट',
    appSubtitle: 'महिला व बाल विकास मंत्रालय · पोषण अभियान',
    centreCode: 'AWC-042',
    centreName: 'शिवाजी नगर केंद्र · प्रभाग १२',
    adminRole: 'अंगणवाडी सेविका',
    adminName: 'रेखा ताई पाटील',
    parentRole: 'पालक / पालकवर्ग',
    offlineReady: 'ऑफलाइन उपलब्ध · डेटा सुरक्षित',
    navDashboard: 'डॅशबोर्ड',
    navChildren: 'बालक नोंदवही',
    navAttendance: 'दैनिक उपस्थिती',
    navGrowth: 'वाढ व पोषण तपासणी',
    navVaccines: 'लसीकरण (U-WIN)',
    navRation: 'पोषण आहार वितरण',
    navImport: 'बल्क CSV अपलोड',
    totalChildren: 'एकूण नोंदणीकृत बालके',
    presentToday: 'आज हजर',
    mamCases: 'मध्यम कुपोषित (MAM)',
    samCases: 'तीव्र कुपोषित (SAM)',
    quickActions: 'जलद कृती',
    enrollChild: 'नवीन बालक नोंदवा',
    markAttendance: 'हजेरी नोंदवा',
    exportCsv: 'डेटा डाउनलोड (CSV)',
    downloadTemplate: 'नमुना CSV फाईल',
    searchPlaceholder: 'नाव, बालक आयडी किंवा मोबाईल शोधा...',
    filterAll: 'सर्व बालके',
    filterNormal: 'सामान्य',
    filterMam: 'MAM बालके',
    filterSam: 'SAM बालके',
    filterAbsent: 'आज गैरहजर',
    statusNormal: 'सामान्य',
    statusMam: 'मध्यम कुपोषित',
    statusSam: 'तीव्र कुपोषित',
    actionViewProfile: 'माहिती पहा',
    actionUpdateGrowth: 'वजन/उंची नोंदवा',
    attendanceMarkAll: 'सर्व हजर नोंदवा',
    vaccineCompleted: 'पूर्ण झाले',
    vaccineDue: 'या महिन्यात देय',
    vaccineUpcoming: 'पुढील लस',
    rationNextDate: 'पुढील पोषण आहार वाटप',
    switchAccess: 'वापरकर्ता बदला',
    parentGreeting: 'बाल आरोग्य पत्रिका',
    poshanTipsTitle: 'पोषण आहार व काळजी मार्गदर्शन',
  }
}

// --- Icons ---
type IconProps = React.SVGProps<SVGSVGElement>
function Icon({ children, ...props }: IconProps & { children?: React.ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
}
const BabyIcon = (props: IconProps) => <Icon {...props}><circle cx="12" cy="8" r="5" /><path d="M7 14c-2 1-3 3-3 5m13-5c2 1 3 3 3 5M9 5 7 3m6 2 2-2M9 10h.01M15 10h.01M9 14c1.5 1 4.5 1 6 0" /></Icon>
const DashboardIcon = (props: IconProps) => <Icon {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></Icon>
const UsersIcon = (props: IconProps) => <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>
const CheckCalendarIcon = (props: IconProps) => <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18m-9 4 2 2 4-4" /></Icon>
const ChartIcon = (props: IconProps) => <Icon {...props}><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" /></Icon>
const VaccineIcon = (props: IconProps) => <Icon {...props}><path d="m18 2 4 4-5.5 5.5-4-4L18 2zM14 6l-9 9v4h4l9-9M3 21l3-3M9.5 10.5l4 4" /></Icon>
const RationIcon = (props: IconProps) => <Icon {...props}><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></Icon>
const UploadIcon = (props: IconProps) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></Icon>
const DownloadIcon = (props: IconProps) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></Icon>
const SearchIcon = (props: IconProps) => <Icon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
const CheckIcon = (props: IconProps) => <Icon {...props}><polyline points="20 6 9 17 4 12" /></Icon>
const CloseIcon = (props: IconProps) => <Icon {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
const ShieldIcon = (props: IconProps) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
const MenuIcon = (props: IconProps) => <Icon {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></Icon>
const AlertTriangle = (props: IconProps) => <Icon {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
const PhoneIcon = (props: IconProps) => <Icon {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>

// --- Data Types ---
type Child = {
  id: string
  name: string
  dob: string
  gender: 'Boy' | 'Girl'
  guardian: string
  mobile: string
  regCode: string
  weight: number
  height: number
  status: 'Normal' | 'MAM' | 'SAM'
  attendance: boolean
  history: { date: string; weight: number; height: number }[]
  vaccines: { name: string; date: string; status: 'completed' | 'due' | 'upcoming' }[]
}

const initialSeed: Child[] = [
  {
    id: 'AW-042-01',
    name: 'Aarav Sachin Gaikwad',
    dob: '2023-08-14',
    gender: 'Boy',
    guardian: 'Sachin Gaikwad',
    mobile: '9890123456',
    regCode: 'ACT-7842-AG',
    weight: 12.8,
    height: 91,
    status: 'Normal',
    attendance: true,
    history: [
      { date: 'Oct 2025', weight: 10.4, height: 82 },
      { date: 'Dec 2025', weight: 11.2, height: 85 },
      { date: 'Feb 2026', weight: 11.8, height: 87 },
      { date: 'Apr 2026', weight: 12.2, height: 89 },
      { date: 'Jun 2026', weight: 12.8, height: 91 }
    ],
    vaccines: [
      { name: 'BCG + OPV-0', date: '14 Aug 2023', status: 'completed' },
      { name: 'Pentavalent 1, 2, 3', date: '14 Feb 2024', status: 'completed' },
      { name: 'Measles-Rubella (MR-1)', date: '15 May 2024', status: 'completed' },
      { name: 'DPT Booster 1', date: '22 Oct 2026', status: 'due' }
    ]
  },
  {
    id: 'AW-042-02',
    name: 'Ananya Rahul Meshram',
    dob: '2024-02-05',
    gender: 'Girl',
    guardian: 'Snehal Meshram',
    mobile: '9765432109',
    regCode: 'ACT-9912-AM',
    weight: 8.5,
    height: 74,
    status: 'MAM',
    attendance: true,
    history: [
      { date: 'Dec 2025', weight: 7.6, height: 69 },
      { date: 'Feb 2026', weight: 7.9, height: 71 },
      { date: 'Apr 2026', weight: 8.2, height: 73 },
      { date: 'Jun 2026', weight: 8.5, height: 74 }
    ],
    vaccines: [
      { name: 'BCG + OPV-0', date: '05 Feb 2024', status: 'completed' },
      { name: 'Pentavalent 1, 2, 3', date: '10 Aug 2024', status: 'completed' },
      { name: 'Vitamin A · Dose 2', date: '25 Oct 2026', status: 'due' },
      { name: 'MR-2 Booster', date: '15 Jan 2027', status: 'upcoming' }
    ]
  },
  {
    id: 'AW-042-03',
    name: 'Vihaan Pramod Shinde',
    dob: '2022-11-20',
    gender: 'Boy',
    guardian: 'Pramod Shinde',
    mobile: '9422187654',
    regCode: 'ACT-3301-VS',
    weight: 14.1,
    height: 98,
    status: 'Normal',
    attendance: false,
    history: [
      { date: 'Oct 2025', weight: 12.8, height: 92 },
      { date: 'Dec 2025', weight: 13.2, height: 94 },
      { date: 'Feb 2026', weight: 13.6, height: 96 },
      { date: 'Apr 2026', weight: 14.1, height: 98 }
    ],
    vaccines: [
      { name: 'Primary Full Schedule', date: 'Completed 2024', status: 'completed' },
      { name: 'Vitamin A Bi-Annual', date: '15 Nov 2026', status: 'upcoming' }
    ]
  },
  {
    id: 'AW-042-04',
    name: 'Pooja Ganesh Jadhav',
    dob: '2024-05-18',
    gender: 'Girl',
    guardian: 'Kavita Jadhav',
    mobile: '9822334455',
    regCode: 'ACT-4421-PJ',
    weight: 6.9,
    height: 68,
    status: 'SAM',
    attendance: true,
    history: [
      { date: 'Feb 2026', weight: 6.2, height: 65 },
      { date: 'Apr 2026', weight: 6.5, height: 67 },
      { date: 'Jun 2026', weight: 6.9, height: 68 }
    ],
    vaccines: [
      { name: 'BCG + Hepatitis B', date: '18 May 2024', status: 'completed' },
      { name: 'Rotavirus + PCV', date: '20 Sep 2024', status: 'completed' },
      { name: 'NRC Health Check', date: '21 Oct 2026', status: 'due' }
    ]
  }
]

function getAgeString(dob: string) {
  const diffMs = Date.now() - new Date(dob).getTime()
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375))
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (years > 0) {
    return `${years}y ${remainingMonths}m`
  }
  return `${months} months`
}

function calculateBMI(weight: number, heightCm: number) {
  if (heightCm <= 0) return 0
  const heightM = heightCm / 100
  return Number((weight / (heightM * heightM)).toFixed(1))
}

export default function Page() {
  const [lang, setLang] = useState<Lang>('en')
  const [role, setRole] = useState<'admin' | 'parent' | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'children' | 'attendance' | 'growth' | 'vaccines' | 'ration' | 'import' | 'profile'>('dashboard')
  const [children, setChildren] = useState<Child[]>(initialSeed)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Normal' | 'MAM' | 'SAM' | 'ABSENT'>('ALL')
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auth fields
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [authError, setAuthError] = useState('')

  // Modals
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showGrowthModal, setShowGrowthModal] = useState(false)
  const [targetChildForGrowth, setTargetChildForGrowth] = useState<Child | null>(null)
  const [newWeight, setNewWeight] = useState('')
  const [newHeight, setNewHeight] = useState('')

  // New child form
  const [newChildName, setNewChildName] = useState('')
  const [newChildDob, setNewChildDob] = useState('2024-01-01')
  const [newChildGender, setNewChildGender] = useState<'Boy' | 'Girl'>('Boy')
  const [newChildGuardian, setNewChildGuardian] = useState('')
  const [newChildMobile, setNewChildMobile] = useState('')
  const [newChildWeight, setNewChildWeight] = useState('10.5')
  const [newChildHeight, setNewChildHeight] = useState('82')

  // CSV import state
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = i18n[lang]

  // Sync to and from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('anganwadi_records')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChildren(parsed)
        }
      }
    } catch (e) {
      console.warn('localStorage read error', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('anganwadi_records', JSON.stringify(children))
    } catch (e) {
      console.warn('localStorage write error', e)
    }
  }, [children])

  // Filtered children list
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchQuery = `${child.name} ${child.id} ${child.guardian} ${child.mobile}`.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchQuery) return false

      if (statusFilter === 'ALL') return true
      if (statusFilter === 'Normal') return child.status === 'Normal'
      if (statusFilter === 'MAM') return child.status === 'MAM'
      if (statusFilter === 'SAM') return child.status === 'SAM'
      if (statusFilter === 'ABSENT') return !child.attendance
      return true
    })
  }, [children, searchQuery, statusFilter])

  // KPI Calculations
  const presentCount = children.filter((c) => c.attendance).length
  const mamCount = children.filter((c) => c.status === 'MAM').length
  const samCount = children.filter((c) => c.status === 'SAM').length
  const totalCount = children.length
  const attendanceRate = totalCount ? Math.round((presentCount / totalCount) * 100) : 0

  // Sign In Handling
  const handleSignIn = () => {
    setAuthError('')
    const cleanUser = username.trim().toLowerCase()
    const cleanPin = pin.trim()

    if (role === 'admin') {
      if (cleanUser === 'admin_aw042' && cleanPin === '123456') {
        setAuthenticated(true)
        setActiveTab('dashboard')
        return
      }
      setAuthError('Invalid credentials. Use demo: admin_aw042 / 123456')
    } else {
      const matched = children.find(
        (c) => c.id.toLowerCase() === cleanUser || (c.mobile === username.trim() && (cleanPin === '' || c.regCode.toLowerCase() === cleanPin.toLowerCase()))
      )
      if (matched) {
        setSelectedChild(matched)
        setAuthenticated(true)
        setActiveTab('profile')
        return
      }
      setAuthError('Child ID or Mobile number not found. Try demo: AW-042-01 or 9890123456')
    }
  }

  // Quick 1-Click Demo Login
  const loginAsDemoAdmin = () => {
    setRole('admin')
    setUsername('admin_aw042')
    setPin('123456')
    setAuthenticated(true)
    setActiveTab('dashboard')
  }

  const loginAsDemoParent = (child: Child = children[0]) => {
    setRole('parent')
    setSelectedChild(child)
    setAuthenticated(true)
    setActiveTab('profile')
  }

  // Attendance Toggle
  const toggleAttendance = (id: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, attendance: !c.attendance } : c))
    )
  }

  const markAllAttendance = (status: boolean) => {
    setChildren((prev) => prev.map((c) => ({ ...c, attendance: status })))
  }

  // Enroll Child
  const handleEnrollChild = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChildName.trim() || !newChildGuardian.trim()) return

    const newId = `AW-042-${String(children.length + 1).padStart(2, '0')}`
    const w = parseFloat(newChildWeight) || 10
    const h = parseFloat(newChildHeight) || 80
    
    // Auto status classification
    let status: 'Normal' | 'MAM' | 'SAM' = 'Normal'
    if (w < 8.0) status = 'SAM'
    else if (w < 9.5) status = 'MAM'

    const newRecord: Child = {
      id: newId,
      name: newChildName.trim(),
      dob: newChildDob,
      gender: newChildGender,
      guardian: newChildGuardian.trim(),
      mobile: newChildMobile.trim() || '9800000000',
      regCode: `ACT-${Math.floor(1000 + Math.random() * 9000)}-${newChildName.slice(0, 2).toUpperCase()}`,
      weight: w,
      height: h,
      status,
      attendance: true,
      history: [{ date: 'Today', weight: w, height: h }],
      vaccines: [
        { name: 'BCG + OPV-0', date: 'At Birth', status: 'completed' },
        { name: 'Pentavalent 1', date: 'Scheduled', status: 'due' }
      ]
    }

    setChildren((prev) => [newRecord, ...prev])
    setShowEnrollModal(false)
    setNewChildName('')
    setNewChildGuardian('')
    setNewChildMobile('')
  }

  // Update Growth
  const handleSaveGrowth = () => {
    if (!targetChildForGrowth) return
    const w = parseFloat(newWeight) || targetChildForGrowth.weight
    const h = parseFloat(newHeight) || targetChildForGrowth.height

    let status: 'Normal' | 'MAM' | 'SAM' = 'Normal'
    if (w < 8.0) status = 'SAM'
    else if (w < 9.5) status = 'MAM'

    setChildren((prev) =>
      prev.map((c) =>
        c.id === targetChildForGrowth.id
          ? {
              ...c,
              weight: w,
              height: h,
              status,
              history: [...c.history, { date: 'Today', weight: w, height: h }]
            }
          : c
      )
    )

    if (selectedChild?.id === targetChildForGrowth.id) {
      setSelectedChild((prev) =>
        prev
          ? {
              ...prev,
              weight: w,
              height: h,
              status,
              history: [...prev.history, { date: 'Today', weight: w, height: h }]
            }
          : null
      )
    }

    setShowGrowthModal(false)
    setTargetChildForGrowth(null)
  }

  // CSV Export & Import
  const exportCsv = () => {
    const headers = 'id,name,dob,gender,guardian,mobile,regCode,weight,height,status,attendance\n'
    const rows = children
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.dob}","${c.gender}","${c.guardian}","${c.mobile}","${c.regCode}",${c.weight},${c.height},"${c.status}",${c.attendance}`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `AWC-042-Anganwadi-Register-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  const downloadSampleTemplate = () => {
    const csvContent =
      'id,name,dob,gender,guardian,mobile,regCode,weight,height,status\nAW-042-05,Tanvi Nilesh Patil,2024-03-12,Girl,Nilesh Patil,9823001122,ACT-5511-TP,9.2,76,Normal\nAW-042-06,Rohan Sunita More,2023-09-08,Boy,Sunita More,9730112233,ACT-6622-RM,11.5,88,Normal\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'Anganwadi-Sample-Template.csv'
    link.click()
  }

  const handleCsvFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result)
        const lines = text.trim().split(/\r?\n/).slice(1)
        const imported: Child[] = []

        for (const line of lines) {
          if (!line.trim()) continue
          const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim())
          if (cols.length >= 8) {
            const [id, name, dob, gender, guardian, mobile, regCode, weight, height, status] = cols
            imported.push({
              id: id || `AW-042-${String(children.length + imported.length + 1).padStart(2, '0')}`,
              name: name || 'Child',
              dob: dob || '2024-01-01',
              gender: gender === 'Girl' ? 'Girl' : 'Boy',
              guardian: guardian || 'Guardian',
              mobile: mobile || '9800000000',
              regCode: regCode || 'ACT-0000',
              weight: parseFloat(weight) || 10,
              height: parseFloat(height) || 80,
              status: status === 'MAM' ? 'MAM' : status === 'SAM' ? 'SAM' : 'Normal',
              attendance: true,
              history: [{ date: 'Imported', weight: parseFloat(weight) || 10, height: parseFloat(height) || 80 }],
              vaccines: [{ name: 'Primary Schedule', date: 'Recorded', status: 'completed' }]
            })
          }
        }

        if (imported.length > 0) {
          setChildren((prev) => [...prev.filter((p) => !imported.some((i) => i.id === p.id)), ...imported])
          setImportMessage(`Successfully imported ${imported.length} child records without errors.`)
        } else {
          setImportMessage('Could not parse valid records. Please check the sample template format.')
        }
      } catch (err) {
        setImportMessage('Error processing CSV. Please ensure standard comma separation.')
      }
    }
    reader.readAsText(file)
  }

  const onDropFile = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) handleCsvFile(e.dataTransfer.files[0])
  }

  // --- 1. Role Selection Screen ---
  if (!role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #ecfdf5 100%)' }}>
        <div className="gov-ribbon" />
        <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-emblem"><ShieldIcon width={24} height={24} /></div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-blue)' }}>{t.appTitle}</h2>
              <span style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{t.appSubtitle}</span>
            </div>
          </div>
          {/* Language Switcher */}
          <div style={{ display: 'flex', gap: '6px', background: 'white', padding: '4px', borderRadius: '10px', border: '1px solid var(--ink-200)' }}>
            {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: lang === l ? 'var(--brand-blue)' : 'transparent',
                  color: lang === l ? 'white' : 'var(--ink-700)'
                }}
              >
                {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '24px' }}>
          <div className="dashboard-card animate-fade" style={{ maxWidth: '580px', width: '100%', padding: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#059669', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '20px' }}>
              <ShieldIcon width={14} height={14} /> {t.centreCode} · {t.centreName}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {lang === 'en' ? 'Welcome to Anganwadi Connect' : lang === 'hi' ? 'आंगनवाड़ी कनेक्ट में आपका स्वागत है' : 'अंगणवाडी कनेक्ट मध्ये आपले स्वागत आहे'}
            </h1>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px', marginBottom: '28px' }}>
              {lang === 'en'
                ? 'Official platform for child growth monitoring, daily attendance, immunization tracking, and parent communication.'
                : lang === 'hi'
                ? 'बाल विकास, दैनिक उपस्थिति, टीकाकरण ट्रैकिंग और पोषण आहार का आधिकारिक डिजिटल मंच।'
                : 'बालकांची वाढ, दैनंदिन हजेरी, लसीकरण आणि पोषण आहाराचा अधिकृत डिजिटल मंच.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div
                onClick={() => setRole('admin')}
                style={{
                  border: '2px solid var(--ink-200)',
                  borderRadius: '16px',
                  padding: '24px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: 'white',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--brand-blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ink-200)')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: 'var(--brand-blue)', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                  <DashboardIcon width={24} height={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.adminRole}</h3>
                <p style={{ fontSize: '12px', color: 'var(--ink-500)' }}>
                  {lang === 'en' ? 'Manage centre register, record attendance & growth' : 'दैनिक हजेरी, पोषण मोजमाप व संपूर्ण केंद्र व्यवस्थापन'}
                </p>
                <button className="btn-primary" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                  {lang === 'en' ? 'Enter as Worker' : 'कार्यकत्री लॉगिन'}
                </button>
              </div>

              <div
                onClick={() => setRole('parent')}
                style={{
                  border: '2px solid var(--ink-200)',
                  borderRadius: '16px',
                  padding: '24px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: 'white',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--poshan-saffron)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ink-200)')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: 'var(--poshan-saffron)', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                  <BabyIcon width={24} height={24} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.parentRole}</h3>
                <p style={{ fontSize: '12px', color: 'var(--ink-500)' }}>
                  {lang === 'en' ? "View your child's nutrition curve, vaccines & ration dates" : 'आपल्या बालकाचे वजन-उंची, लसीकरण व पोषण आहार'}
                </p>
                <button className="btn-accent" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                  {lang === 'en' ? 'Enter as Parent' : 'पालक लॉगिन'}
                </button>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--ink-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-400)', textTransform: 'uppercase' }}>Quick Demo 1-Click Access</span>
                <p style={{ fontSize: '12px', color: 'var(--ink-700)', marginTop: '2px' }}>Instant access for evaluation &amp; testing:</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={loginAsDemoAdmin} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  Demo Worker
                </button>
                <button onClick={() => loginAsDemoParent()} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  Demo Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 2. Sign In Screen ---
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #ecfdf5 100%)' }}>
        <div className="gov-ribbon" />
        <div style={{ padding: '20px 32px' }}>
          <button onClick={() => { setRole(null); setAuthError('') }} className="btn-secondary">
            ← {lang === 'en' ? 'Back to role selection' : 'मागे जा'}
          </button>
        </div>

        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '24px' }}>
          <div className="dashboard-card animate-fade" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: role === 'admin' ? '#eff6ff' : '#fffbeb', color: role === 'admin' ? 'var(--brand-blue)' : 'var(--poshan-saffron)', padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, marginBottom: '16px' }}>
              {role === 'admin' ? 'WORKER AUTHENTICATION' : 'PARENT PASSPORT ACCESS'}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              {role === 'admin' ? 'Sign in to Centre Register' : 'Check Child Health Passport'}
            </h2>
            <p style={{ color: 'var(--ink-500)', fontSize: '13px', marginBottom: '24px' }}>
              {role === 'admin'
                ? 'Enter your assigned Worker ID and Security PIN.'
                : 'Enter your Child ID (e.g. AW-042-01) or Registered Mobile Number.'}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleSignIn() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-700)', marginBottom: '6px' }}>
                  {role === 'admin' ? 'Username / Worker ID' : 'Child ID or Mobile Number'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'admin' ? 'admin_aw042' : 'AW-042-01 or 9890123456'}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-700)', marginBottom: '6px' }}>
                  {role === 'admin' ? 'PIN / Password' : 'Registration Code (Optional)'}
                </label>
                <input
                  type={role === 'admin' ? 'password' : 'text'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={role === 'admin' ? '123456' : 'ACT-7842-AG'}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {authError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                  {authError}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                {lang === 'en' ? 'Sign In Securely' : 'लॉगिन करा'}
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--ink-200)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-400)' }}>Demo Credentials:</span>
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-700)' }}>
                {role === 'admin' ? (
                  <>ID: <b>admin_aw042</b> | PIN: <b>123456</b></>
                ) : (
                  <>ID: <b>AW-042-01</b> or Mobile: <b>9890123456</b></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 3. Parent Health Passport Screen ---
  if (role === 'parent' || activeTab === 'profile') {
    const child = selectedChild || children[0]
    const bmi = calculateBMI(child.weight, child.height)

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
        <div className="gov-ribbon" />
        <header className="top-bar">
          <div className="top-bar-left">
            {role === 'admin' && (
              <button onClick={() => setActiveTab('children')} className="btn-secondary">
                ← {lang === 'en' ? 'Back to Register' : 'नोंदवहीकडे परत'}
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="brand-emblem" style={{ width: '36px', height: '36px' }}><BabyIcon width={20} height={20} /></div>
              <div>
                <b style={{ fontSize: '14px' }}>{t.appTitle}</b>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--ink-500)' }}>{t.centreCode} · {t.centreName}</span>
              </div>
            </div>
          </div>
          <div className="top-bar-right">
            <button
              onClick={() => {
                setRole(null)
                setAuthenticated(false)
                setSelectedChild(null)
              }}
              className="btn-secondary"
            >
              {t.switchAccess}
            </button>
          </div>
        </header>

        <div className="main-content animate-fade">
          {/* Parent Hero Banner */}
          <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, marginBottom: '12px' }}>
                <span className="pulse-dot" style={{ background: '#34d399' }} /> {t.offlineReady}
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
                {lang === 'en' ? `Namaste, ${child.guardian}` : `नमस्ते, ${child.guardian}`}
              </h1>
              <p style={{ opacity: 0.9, fontSize: '13px' }}>
                {lang === 'en'
                  ? `Here is the verified health, nutrition, and vaccine passport for ${child.name}.`
                  : `${child.name} ची अधिकृत आरोग्य, पोषण व लसीकरण पत्रिका.`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="tel:9890001122" className="btn-accent" style={{ textDecoration: 'none' }}>
                <PhoneIcon width={16} height={16} /> Contact Sevika ({t.adminName})
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Child Profile Card */}
            <div className="dashboard-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dbeafe', color: 'var(--brand-blue)', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 800 }}>
                  {child.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{child.name}</h2>
                  <span style={{ fontSize: '12px', color: 'var(--ink-500)' }}>ID: <b>{child.id}</b> · {child.gender} · {getAgeString(child.dob)}</span>
                  <div style={{ marginTop: '8px' }}>
                    <span className={`status-badge ${child.status.toLowerCase()}`}>
                      {child.status === 'Normal' ? '● ' + t.statusNormal : child.status === 'MAM' ? '▲ ' + t.statusMam : '■ ' + t.statusSam}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--ink-200)', marginBottom: '20px' }}>
                <div>
                  <small style={{ fontSize: '11px', color: 'var(--ink-500)', display: 'block' }}>Current Weight</small>
                  <strong style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink-900)' }}>{child.weight} kg</strong>
                </div>
                <div>
                  <small style={{ fontSize: '11px', color: 'var(--ink-500)', display: 'block' }}>Height</small>
                  <strong style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink-900)' }}>{child.height} cm</strong>
                </div>
                <div>
                  <small style={{ fontSize: '11px', color: 'var(--ink-500)', display: 'block' }}>BMI Index</small>
                  <strong style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink-900)' }}>{bmi}</strong>
                </div>
              </div>

              {/* Poshan Nutritional Advice */}
              <div style={{ background: child.status === 'Normal' ? '#ecfdf5' : '#fffbeb', border: `1px solid ${child.status === 'Normal' ? '#a7f3d0' : '#fde68a'}`, padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: child.status === 'Normal' ? '#065f46' : '#92400e', marginBottom: '4px' }}>
                  {t.poshanTipsTitle}
                </h4>
                <p style={{ fontSize: '12px', color: child.status === 'Normal' ? '#047857' : '#b45309', lineHeight: 1.5 }}>
                  {child.status === 'Normal'
                    ? 'Child is thriving normally! Continue offering home-cooked mixed khichdi, seasonal fruits, eggs/milk, and clean boiled water.'
                    : child.status === 'MAM'
                    ? 'Child needs moderate nutritional support. Sevika has provided fortified Take-Home Ration (THR). Add ghee and roasted groundnut paste to daily meals.'
                    : 'URGENT: Child is Severely Malnourished (SAM). Please visit Primary Health Centre (PHC) for NRC therapeutic feeding and specialized checkup.'}
                </p>
              </div>
            </div>

            {/* Growth Curve Chart */}
            <div className="dashboard-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>WHO Growth Progression</h3>
                  <p style={{ fontSize: '12px', color: 'var(--ink-500)' }}>Weight trajectory compared against WHO standards</p>
                </div>
                {role === 'admin' && (
                  <button
                    onClick={() => {
                      setTargetChildForGrowth(child)
                      setNewWeight(String(child.weight))
                      setNewHeight(String(child.height))
                      setShowGrowthModal(true)
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '12px' }}
                  >
                    + Log Growth
                  </button>
                )}
              </div>

              <div style={{ height: '180px', width: '100%', background: '#fafafa', borderRadius: '12px', padding: '12px', position: 'relative' }}>
                <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />

                  {/* Ideal Curve (Green Dashed) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    points="0,130 80,105 160,85 240,65 320,50 400,35"
                  />

                  {/* Child Actual Curve (Blue Solid) */}
                  <polyline
                    fill="none"
                    stroke="var(--brand-blue)"
                    strokeWidth="3.5"
                    points={child.history
                      .map((h, i) => `${(i / Math.max(1, child.history.length - 1)) * 360 + 20},${140 - (h.weight / 16) * 110}`)
                      .join(' ')}
                  />

                  {/* Data Points */}
                  {child.history.map((h, i) => {
                    const x = (i / Math.max(1, child.history.length - 1)) * 360 + 20
                    const y = 140 - (h.weight / 16) * 110
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="var(--brand-blue)" stroke="white" strokeWidth="2" />
                        <text x={x} y={y - 8} fontSize="9" textAnchor="middle" fill="var(--ink-700)" fontWeight="bold">
                          {h.weight}kg
                        </text>
                        <text x={x} y="145" fontSize="8" textAnchor="middle" fill="var(--ink-400)">
                          {h.date}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: 'var(--ink-500)', justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--brand-blue)', display: 'inline-block' }} /> {child.name} Actual
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '3px', background: '#10b981', display: 'inline-block', borderBottom: '1px dashed #10b981' }} /> WHO Normal 50th Percentile
                </span>
              </div>
            </div>

            {/* Immunization Tracker */}
            <div className="dashboard-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Immunization Record (U-WIN)</h3>
              <p style={{ fontSize: '12px', color: 'var(--ink-500)', marginBottom: '16px' }}>Official Poshan Abhiyaan vaccine schedule</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {child.vaccines.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--ink-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: v.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: v.status === 'completed' ? '#059669' : '#d97706', display: 'grid', placeItems: 'center' }}>
                        {v.status === 'completed' ? <CheckIcon width={14} height={14} /> : <VaccineIcon width={13} height={13} />}
                      </div>
                      <div>
                        <b style={{ fontSize: '13px', display: 'block' }}>{v.name}</b>
                        <small style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{v.date}</small>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', background: v.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: v.status === 'completed' ? '#059669' : '#d97706' }}>
                      {v.status === 'completed' ? t.vaccineCompleted : t.vaccineDue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Ration & Centre Notice */}
            <div className="dashboard-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.rationNextDate}</h3>
              <p style={{ fontSize: '12px', color: 'var(--ink-500)', marginBottom: '16px' }}>Take-Home Ration &amp; Nutrition Support</p>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Next Distribution Day</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>Thursday, 22 October 2026</h4>
                <p style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>Time: 10:00 AM – 1:30 PM</p>
                <p style={{ fontSize: '12px', color: '#047857' }}>Location: Shivaji Nagar Anganwadi Centre (AWC-042)</p>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--ink-700)', lineHeight: 1.6 }}>
                <b>Entitlement per child:</b> Fortified Weaning Food (Daliya/Khichdi premix) 2.5 kg, 8 Eggs or Banana ration, Micronutrient powder.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 4. Worker Workspace Dashboard & Management ---
  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 35 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="gov-ribbon" />
        <div className="sidebar-brand">
          <div className="brand-emblem"><ShieldIcon width={22} height={22} /></div>
          <div className="brand-text">
            <h1>{t.appTitle}</h1>
            <span>AWC-042 Register</span>
          </div>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent' }}>
              <CloseIcon width={20} height={20} />
            </button>
          )}
        </div>

        <div className="centre-badge-card">
          <div className="centre-badge-header">
            <span>Active Centre</span>
            <span style={{ color: 'var(--status-normal)' }}>● Active</span>
          </div>
          <div className="centre-code">{t.centreCode}</div>
          <div className="centre-location">{t.centreName}</div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Workspace</span>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false) }}
          >
            <DashboardIcon width={18} height={18} /> {t.navDashboard}
          </button>
          <button
            className={`nav-item ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => { setActiveTab('children'); setMobileMenuOpen(false) }}
          >
            <UsersIcon width={18} height={18} /> {t.navChildren}
          </button>
          <button
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attendance'); setMobileMenuOpen(false) }}
          >
            <CheckCalendarIcon width={18} height={18} /> {t.navAttendance}
          </button>
          <button
            className={`nav-item ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => { setActiveTab('growth'); setMobileMenuOpen(false) }}
          >
            <ChartIcon width={18} height={18} /> {t.navGrowth}
          </button>
          <button
            className={`nav-item ${activeTab === 'vaccines' ? 'active' : ''}`}
            onClick={() => { setActiveTab('vaccines'); setMobileMenuOpen(false) }}
          >
            <VaccineIcon width={18} height={18} /> {t.navVaccines}
          </button>
          <button
            className={`nav-item ${activeTab === 'ration' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ration'); setMobileMenuOpen(false) }}
          >
            <RationIcon width={18} height={18} /> {t.navRation}
          </button>
          <button
            className={`nav-item ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => { setActiveTab('import'); setMobileMenuOpen(false) }}
          >
            <UploadIcon width={18} height={18} /> {t.navImport}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="offline-pill">
            <span className="pulse-dot" />
            <span>{t.offlineReady}</span>
          </div>

          <div className="user-card">
            <div className="user-avatar">RP</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: '13px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {t.adminName}
              </b>
              <small style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{t.adminRole}</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        <div className="gov-ribbon" />
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ display: 'none', border: 'none', background: 'transparent', cursor: 'pointer' }}
              className="mobile-menu-btn"
            >
              <MenuIcon width={22} height={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink-500)' }}>
              <span>{t.centreCode}</span>
              <b>/</b>
              <strong style={{ color: 'var(--ink-900)' }}>
                {activeTab === 'dashboard' ? t.navDashboard : activeTab === 'children' ? t.navChildren : activeTab === 'attendance' ? t.navAttendance : activeTab === 'growth' ? t.navGrowth : activeTab === 'vaccines' ? t.navVaccines : activeTab === 'ration' ? t.navRation : t.navImport}
              </strong>
            </div>
          </div>

          <div className="top-bar-right">
            {/* Language Selector */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: lang === l ? 'white' : 'transparent',
                    color: lang === l ? 'var(--brand-blue)' : 'var(--ink-700)',
                    boxShadow: lang === l ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'मरा'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setRole(null)
                setAuthenticated(false)
              }}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '7px 12px' }}
            >
              {t.switchAccess}
            </button>
          </div>
        </header>

        <div className="main-content">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade">
              {/* Header greeting */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--poshan-saffron)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Poshan Abhiyaan Centre Dashboard
                  </span>
                  <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '2px' }}>
                    {lang === 'en' ? `Good day, ${t.adminName}` : `नमस्कार, ${t.adminName}`}
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                    Centre AWC-042 records are updated &amp; synchronized.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowEnrollModal(true)} className="btn-accent">
                    + {t.enrollChild}
                  </button>
                  <button onClick={exportCsv} className="btn-secondary">
                    <DownloadIcon width={16} height={16} /> {t.exportCsv}
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">{t.totalChildren}</span>
                    <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: 'var(--brand-blue)' }}>
                      <UsersIcon width={20} height={20} />
                    </div>
                  </div>
                  <div className="kpi-value">{totalCount}</div>
                  <div className="kpi-note">Enrolled in Shivaji Nagar Ward</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">{t.presentToday}</span>
                    <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <CheckCalendarIcon width={20} height={20} />
                    </div>
                  </div>
                  <div className="kpi-value">{presentCount} <span style={{ fontSize: '16px', color: 'var(--ink-500)', fontWeight: 500 }}>/ {totalCount}</span></div>
                  <div className="kpi-note" style={{ color: '#059669' }}>
                    ● {attendanceRate}% Daily Attendance
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">{t.mamCases}</span>
                    <div className="kpi-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
                      <AlertTriangle width={20} height={20} />
                    </div>
                  </div>
                  <div className="kpi-value" style={{ color: '#d97706' }}>{mamCount}</div>
                  <div className="kpi-note">Double Take-Home Ration Assigned</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">{t.samCases}</span>
                    <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      <AlertTriangle width={20} height={20} />
                    </div>
                  </div>
                  <div className="kpi-value" style={{ color: '#dc2626' }}>{samCount}</div>
                  <div className="kpi-note" style={{ color: '#dc2626' }}>NRC Referral Tracking Needed</div>
                </div>
              </div>

              {/* Urgent Nutrition Follow-ups */}
              {(mamCount > 0 || samCount > 0) && (
                <div className="dashboard-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--poshan-saffron)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <AlertTriangle width={18} height={18} color="var(--poshan-saffron)" />
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Priority Nutrition Interventions</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {children.filter((c) => c.status !== 'Normal').map((child) => (
                      <div key={child.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--ink-200)' }}>
                        <div>
                          <b style={{ fontSize: '13px', display: 'block' }}>{child.name}</b>
                          <small style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{child.id} · Guardian: {child.guardian}</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${child.status.toLowerCase()}`}>{child.status}</span>
                          <button
                            onClick={() => {
                              setSelectedChild(child)
                              setActiveTab('profile')
                            }}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Follow up
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Children Overview Table */}
              <div className="dashboard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Live Centre Register</h3>
                    <p style={{ fontSize: '12px', color: 'var(--ink-500)' }}>Tap any child to inspect detailed health passport</p>
                  </div>
                  <button onClick={() => setActiveTab('children')} className="btn-secondary" style={{ fontSize: '12px' }}>
                    View Full Register →
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Child Name &amp; ID</th>
                        <th>Age / Gender</th>
                        <th>Guardian &amp; Mobile</th>
                        <th>Nutrition Status</th>
                        <th>Today's Attendance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.slice(0, 5).map((child) => (
                        <tr key={child.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', color: 'var(--brand-blue)', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700 }}>
                                {child.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <b>{child.name}</b>
                                <small style={{ display: 'block', fontSize: '11px', color: 'var(--ink-500)' }}>{child.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>{getAgeString(child.dob)} · {child.gender}</td>
                          <td>
                            <div>{child.guardian}</div>
                            <small style={{ color: 'var(--ink-500)' }}>{child.mobile}</small>
                          </td>
                          <td>
                            <span className={`status-badge ${child.status.toLowerCase()}`}>
                              {child.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleAttendance(child.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: child.attendance ? '#ecfdf5' : '#fef2f2',
                                color: child.attendance ? '#059669' : '#dc2626'
                              }}
                            >
                              {child.attendance ? '● Present' : '○ Absent'}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setSelectedChild(child)
                                setActiveTab('profile')
                              }}
                              className="btn-secondary"
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                              {t.actionViewProfile}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHILDREN REGISTER */}
          {activeTab === 'children' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navChildren}</h1>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>Search, enroll, and view growth profiles</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowEnrollModal(true)} className="btn-accent">
                    + {t.enrollChild}
                  </button>
                  <button onClick={exportCsv} className="btn-secondary">
                    <DownloadIcon width={16} height={16} /> {t.exportCsv}
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="dashboard-card" style={{ marginBottom: '20px', padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--ink-200)' }}>
                    <SearchIcon width={18} height={18} color="var(--ink-400)" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                    />
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(['ALL', 'Normal', 'MAM', 'SAM', 'ABSENT'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--ink-200)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: statusFilter === f ? 'var(--brand-blue)' : 'white',
                          color: statusFilter === f ? 'white' : 'var(--ink-700)'
                        }}
                      >
                        {f === 'ALL' ? t.filterAll : f === 'Normal' ? t.filterNormal : f === 'MAM' ? t.filterMam : f === 'SAM' ? t.filterSam : t.filterAbsent}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="dashboard-card">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Child Details</th>
                        <th>Age &amp; Gender</th>
                        <th>Guardian</th>
                        <th>Contact</th>
                        <th>Weight / Height</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChildren.map((child) => (
                        <tr key={child.id}>
                          <td>
                            <b style={{ fontSize: '13px' }}>{child.name}</b>
                            <small style={{ display: 'block', fontSize: '11px', color: 'var(--ink-500)' }}>ID: {child.id}</small>
                          </td>
                          <td>{getAgeString(child.dob)} · {child.gender}</td>
                          <td>{child.guardian}</td>
                          <td>
                            <a href={`tel:${child.mobile}`} style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 600 }}>
                              {child.mobile}
                            </a>
                          </td>
                          <td>
                            <b>{child.weight} kg</b> · {child.height} cm
                          </td>
                          <td>
                            <span className={`status-badge ${child.status.toLowerCase()}`}>
                              {child.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setSelectedChild(child)
                                setActiveTab('profile')
                              }}
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              {t.actionViewProfile}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DAILY ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navAttendance}</h1>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                    Daily Attendance Register · {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => markAllAttendance(true)} className="btn-secondary">
                    <CheckIcon width={16} height={16} /> {t.attendanceMarkAll}
                  </button>
                  <button onClick={() => markAllAttendance(false)} className="btn-secondary">
                    Reset All
                  </button>
                </div>
              </div>

              <div className="dashboard-card" style={{ maxWidth: '850px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--ink-200)', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>
                    Attendance Summary: <span style={{ color: '#059669' }}>{presentCount} Present</span> · <span style={{ color: '#dc2626' }}>{totalCount - presentCount} Absent</span>
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink-500)' }}>Instant Tap to Toggle</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {children.map((child) => (
                    <div
                      key={child.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: child.attendance ? '#f0fdf4' : '#fff',
                        border: `1px solid ${child.attendance ? '#bbf7d0' : 'var(--ink-200)'}`,
                        borderRadius: '10px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: child.attendance ? '#d1fae5' : '#fee2e2', color: child.attendance ? '#059669' : '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '12px' }}>
                          {child.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <b style={{ fontSize: '14px', display: 'block' }}>{child.name}</b>
                          <small style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{child.id} · Guardian: {child.guardian}</small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            if (!child.attendance) toggleAttendance(child.id)
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: child.attendance ? '#059669' : 'var(--ink-200)',
                            background: child.attendance ? '#059669' : 'white',
                            color: child.attendance ? 'white' : 'var(--ink-700)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <CheckIcon width={13} height={13} style={{ display: 'inline', marginRight: '4px' }} /> Present
                        </button>
                        <button
                          onClick={() => {
                            if (child.attendance) toggleAttendance(child.id)
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: !child.attendance ? '#dc2626' : 'var(--ink-200)',
                            background: !child.attendance ? '#dc2626' : 'white',
                            color: !child.attendance ? 'white' : 'var(--ink-700)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GROWTH & NUTRITION MONITOR */}
          {activeTab === 'growth' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navGrowth}</h1>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>WHO Growth Standards, Z-Score Monitoring &amp; Anthropometry</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {children.map((child) => (
                  <div key={child.id} className="dashboard-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{child.name}</h3>
                        <small style={{ color: 'var(--ink-500)', fontSize: '11px' }}>ID: {child.id} · {getAgeString(child.dob)}</small>
                      </div>
                      <span className={`status-badge ${child.status.toLowerCase()}`}>{child.status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                      <div>
                        <small style={{ fontSize: '11px', color: 'var(--ink-500)', display: 'block' }}>Weight</small>
                        <b style={{ fontSize: '18px' }}>{child.weight} kg</b>
                      </div>
                      <div>
                        <small style={{ fontSize: '11px', color: 'var(--ink-500)', display: 'block' }}>Height</small>
                        <b style={{ fontSize: '18px' }}>{child.height} cm</b>
                      </div>
                    </div>

                    <div style={{ height: '70px', marginBottom: '12px' }}>
                      <svg viewBox="0 0 200 60" style={{ width: '100%', height: '100%' }}>
                        <polyline
                          fill="none"
                          stroke={child.status === 'Normal' ? '#059669' : '#d97706'}
                          strokeWidth="2.5"
                          points="0,50 40,45 80,42 120,35 160,30 200,20"
                        />
                      </svg>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setTargetChildForGrowth(child)
                          setNewWeight(String(child.weight))
                          setNewHeight(String(child.height))
                          setShowGrowthModal(true)
                        }}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                      >
                        {t.actionUpdateGrowth}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChild(child)
                          setActiveTab('profile')
                        }}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VACCINATIONS & IMMUNIZATION */}
          {activeTab === 'vaccines' && (
            <div className="animate-fade">
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navVaccines}</h1>
                <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>U-WIN Linked Universal Immunization Programme (UIP) Tracker</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {children.map((child) => (
                  <div key={child.id} className="dashboard-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{child.name}</h3>
                        <small style={{ color: 'var(--ink-500)', fontSize: '11px' }}>{child.id} · {getAgeString(child.dob)}</small>
                      </div>
                      <span className={`status-badge ${child.status.toLowerCase()}`}>{child.status}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {child.vaccines.map((v, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--ink-200)' }}>
                          <div>
                            <b style={{ fontSize: '12px', display: 'block' }}>{v.name}</b>
                            <small style={{ fontSize: '11px', color: 'var(--ink-500)' }}>{v.date}</small>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: v.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: v.status === 'completed' ? '#059669' : '#d97706' }}>
                            {v.status === 'completed' ? 'Done' : 'Due Soon'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RATION & POSHAN DISTRIBUTION */}
          {activeTab === 'ration' && (
            <div className="animate-fade">
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navRation}</h1>
                <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>Supplementary Nutrition Programme (SNP) &amp; Take-Home Ration (THR)</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div className="dashboard-card">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Upcoming Distribution Session</h3>
                  <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '16px' }}>
                    <b style={{ fontSize: '18px', color: '#065f46', display: 'block' }}>Thursday, 22 October 2026</b>
                    <span style={{ fontSize: '12px', color: '#047857' }}>10:00 AM – 1:30 PM · AWC-042, Shivaji Nagar</span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--ink-700)', lineHeight: 1.6 }}>
                    <p><b>Target Beneficiaries:</b> 18 Enrolled Children (6 months – 3 years) &amp; 4 Pregnant / Lactating Mothers.</p>
                    <p style={{ marginTop: '8px' }}><b>Stock Prepared:</b> Fortified Weaning Premix, Ready-to-Eat nutrient packets, Iron &amp; Folic Acid drops.</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Daily Snack &amp; Hot Meal Tracker</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <span>Boiled Eggs / Bananas</span>
                      <b style={{ color: '#059669' }}>Distributed (18/18)</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <span>Nutritious Hot Khichdi with Veggies</span>
                      <b style={{ color: '#059669' }}>Served at 11:30 AM</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <span>Clean Boiled Drinking Water</span>
                      <b style={{ color: '#059669' }}>Verified</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BULK CSV UPLOAD */}
          {activeTab === 'import' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t.navImport}</h1>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>Batch register Anganwadi children from CSV spreadsheet</p>
                </div>
                <button onClick={downloadSampleTemplate} className="btn-secondary">
                  <DownloadIcon width={16} height={16} /> {t.downloadTemplate}
                </button>
              </div>

              <div className="dashboard-card" style={{ maxWidth: '780px' }}>
                <div
                  onDrop={onDropFile}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--brand-blue-border)',
                    borderRadius: '16px',
                    padding: '50px 20px',
                    textAlign: 'center',
                    background: '#f8fbff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <UploadIcon width={40} height={40} color="var(--brand-blue)" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Drop your CSV spreadsheet here</h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>or click to browse from your device storage</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files?.[0]) handleCsvFile(e.target.files[0])
                    }}
                    style={{ display: 'none' }}
                  />
                </div>

                {importMessage && (
                  <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '13px', fontWeight: 600 }}>
                    {importMessage}
                  </div>
                )}

                <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: '12px', color: 'var(--ink-700)' }}>
                  <b>Required columns:</b> <code>id, name, dob, gender, guardian, mobile, regCode, weight, height, status</code>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: ENROLL NEW CHILD */}
      {showEnrollModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--ink-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Enroll New Child into AWC-042</h3>
              <button onClick={() => setShowEnrollModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleEnrollChild} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Child Full Name *</label>
                <input
                  required
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Tanvi Nilesh Patil"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Date of Birth *</label>
                  <input
                    required
                    type="date"
                    value={newChildDob}
                    onChange={(e) => setNewChildDob(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Gender</label>
                  <select
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value as 'Boy' | 'Girl')}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Mother / Guardian *</label>
                  <input
                    required
                    type="text"
                    value={newChildGuardian}
                    onChange={(e) => setNewChildGuardian(e.target.value)}
                    placeholder="e.g. Sunita Patil"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    value={newChildMobile}
                    onChange={(e) => setNewChildMobile(e.target.value)}
                    placeholder="e.g. 9822001122"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Weight (kg) *</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    value={newChildWeight}
                    onChange={(e) => setNewChildWeight(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Height (cm) *</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    value={newChildHeight}
                    onChange={(e) => setNewChildHeight(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEnrollModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-accent">
                  Confirm &amp; Register Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE GROWTH RECORD */}
      {showGrowthModal && targetChildForGrowth && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--ink-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Log Growth: {targetChildForGrowth.name}</h3>
              <button onClick={() => setShowGrowthModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                Enter latest anthropometric measurements taken today at centre.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Height (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button onClick={() => setShowGrowthModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveGrowth} className="btn-primary">
                  Save Measurement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
