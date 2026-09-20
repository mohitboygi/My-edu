import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import {
  GraduationCap, User, UserCog, Users, Shield, Image as ImageIcon, BookOpen, ArrowLeft,
  Bell, X, ChevronRight, ClipboardCheck, FileText, CalendarDays, LogOut,
  Menu, BarChart3, ClipboardList, UserPlus, Users2, Megaphone, MessageSquare, Send,
  CheckSquare, Square, Trash2, Clock, AlertTriangle,
  History, CheckCircle2, XCircle, Clock3, Target, Trophy,
  Atom, FlaskConical, Dna, RotateCw,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const colors = {
  bg: "#EAF4FF",
  bgSoft: "#D6EBFF",
  primary: "#2D7DD2",
  primaryDark: "#1B5FA8",
  ink: "#1B2A41",
  inkSoft: "#5C7089",
  card: "#FFFFFF",
  green: "#22A06B",
  red: "#E05252",
  orange: "#F59E0B",
};

const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const loginOptions = [
  { key: "student", label: "Student login", icon: User },
  { key: "teacher", label: "Teacher login", icon: UserCog },
  { key: "parent", label: "Parent login", icon: Users },
  { key: "admin", label: "Admin login", icon: Shield },
];

// Demo student data
const student = {
  name: "Rohan Sharma",
  phone: "+91 98765 43210",
  studentId: "MYEDU20260041",
  standard: "8-A",
  school: "Sunrise Public School",
};

const subjects = {
  Mathematics: ["Real Numbers", "Polynomials", "Pair of Linear Equations"],
  Science: ["Chemical Reactions", "Acids, Bases & Salts", "Life Processes"],
  English: ["A Letter to God", "Nelson Mandela", "Two Stories About Flying"],
  "Social Studies": ["Resources & Development", "Forest & Wildlife", "Power Sharing"],
  Hindi: ["क्षितिज", "कृतिका", "व्याकरण"],
};

const notes = {
  "Real Numbers": `
Real numbers include rational and irrational numbers.

Important topics:
• Euclid's Division Algorithm
• Fundamental Theorem of Arithmetic
• HCF and LCM
• Irrational numbers
• Decimal expansions
`,
  Polynomials: `
A polynomial is an algebraic expression containing variables and coefficients.

Important topics:
• Degree
• Zeroes
• Relationship between zeroes and coefficients
• Division algorithm
`,
  "Chemical Reactions": `
Chemical reactions involve transformation of reactants into products.

Important types:
• Combination
• Decomposition
• Displacement
• Double displacement
• Oxidation
• Reduction
`,
  "Life Processes": `
Life processes are the basic activities necessary for maintaining life.

Main processes:
• Nutrition
• Respiration
• Transportation
• Excretion
`,
};

const mcqDatabase = {
  "Real Numbers": [
    { id: 1, question: "Which of the following is an irrational number?", options: ["2", "3/4", "√2", "0.25"], answer: 2 },
    { id: 2, question: "The HCF of 12 and 18 is:", options: ["2", "3", "6", "9"], answer: 2 },
    { id: 3, question: "Which number has a terminating decimal expansion?", options: ["1/3", "1/7", "1/8", "2/9"], answer: 2 },
    { id: 4, question: "The decimal expansion of 1/2 is:", options: ["Terminating", "Non-terminating", "Recurring only", "Irrational"], answer: 0 },
    { id: 5, question: "Which of these is a rational number?", options: ["√2", "√3", "5/7", "π"], answer: 2 },
    { id: 6, question: "The LCM of 4 and 6 is:", options: ["8", "10", "12", "24"], answer: 2 },
    { id: 7, question: "If HCF(a,b) = 5 and LCM(a,b) = 60, then ab equals:", options: ["12", "55", "300", "65"], answer: 2 },
    { id: 8, question: "Which of the following is not irrational?", options: ["√5", "√7", "√11", "√16"], answer: 3 },
  ],
  Polynomials: [
    { id: 1, question: "The degree of 5x² + 3x + 1 is:", options: ["1", "2", "3", "5"], answer: 1 },
    { id: 2, question: "A polynomial of degree 2 is called:", options: ["Linear", "Quadratic", "Cubic", "Constant"], answer: 1 },
    { id: 3, question: "The degree of a non-zero constant polynomial is:", options: ["0", "1", "2", "Undefined"], answer: 0 },
  ],
  "Chemical Reactions": [
    { id: 1, question: "A reaction in which two or more substances combine is called:", options: ["Decomposition", "Combination", "Displacement", "Neutralisation"], answer: 1 },
    { id: 2, question: "Rusting of iron is an example of:", options: ["Oxidation", "Reduction", "Neutralisation", "Double displacement"], answer: 0 },
    { id: 3, question: "Breaking a compound into simpler substances is called:", options: ["Combination", "Decomposition", "Displacement", "Oxidation"], answer: 1 },
  ],
};

const initialActivity = {
  daysOpened: [1, 2, 3, 4],
  subjectsViewed: ["Mathematics", "Science", "English"],
  chaptersViewed: ["Real Numbers", "Chemical Reactions", "Life Processes"],
  mcqAttempts: [],
};

// --- Admin / Principal demo data ---
const admin = {
  phone: "+91 90000 11111",
  school: "Sunrise Public School",
};
const schoolMaxClass = 10; // this school goes up to Class 10
const classesList = Array.from({ length: schoolMaxClass }, (_, i) => i + 1);

// Today's attendance per class (demo)
const todayClassData = [
  { class: 1, total: 45, present: 42 },
  { class: 2, total: 48, present: 44 },
  { class: 3, total: 50, present: 45 },
  { class: 4, total: 42, present: 38 },
  { class: 5, total: 47, present: 43 },
  { class: 6, total: 44, present: 39 },
  { class: 7, total: 46, present: 41 },
  { class: 8, total: 43, present: 40 },
  { class: 9, total: 49, present: 44 },
  { class: 10, total: 40, present: 35 },
].map((c) => ({ ...c, absent: c.total - c.present, percent: Math.round((c.present / c.total) * 100) }));

// --- Teacher demo data ---
const teacherInfo = {
  name: "Mrs. Fatima Sheikh",
  phone: "+91 91234 56780",
  std: "Class 6",
  subject: "Mathematics",
};
const initialTeacherStudents = [
  { roll: 1, name: "Aarav Mehta", phone: "9876500001", email: "aarav.mehta@email.com", password: "aarav123", presentToday: null, lateToday: false },
  { roll: 2, name: "Diya Kapoor", phone: "9876500002", email: "diya.kapoor@email.com", password: "diya123", presentToday: null, lateToday: false },
  { roll: 3, name: "Rohan Sharma", phone: "9876500003", email: "rohan.sharma@email.com", password: "rohan123", presentToday: null, lateToday: false },
  { roll: 4, name: "Ananya Iyer", phone: "9876500004", email: "ananya.iyer@email.com", password: "ananya123", presentToday: null, lateToday: false },
  { roll: 5, name: "Vivaan Gupta", phone: "9876500005", email: "vivaan.gupta@email.com", password: "vivaan123", presentToday: null, lateToday: false },
];
const principalAnnouncementsDemo = [
  { text: "Staff meeting on Monday, 8:30 AM in the staff room.", date: "1 Sept" },
  { text: "Submit mid-term marks by 10 September.", date: "30 Aug" },
];

// --- Parent demo data ---
const parentInfo = {
  phone: "+91 90000 55555",
  childName: student.name,
  childStudentId: student.studentId,
  childStandard: student.standard,
  childSchool: student.school,
};
// "present" | "late" | "absent" — set live by the teacher on the attendance screen
const todayChildStatus = "present";
const parentAnnouncementsDemo = [
  { text: "PTM scheduled for Saturday, 10 AM in the main hall.", from: "Principal", date: "1 Sept" },
  { text: "Please send extra notebooks for the Science project.", from: "Class teacher", date: "30 Aug" },
];

// --- Platform / trial / billing demo data ---
const TRIAL_DAYS = 7;
const PRICE_PER_STUDENT = 50; // ₹ per student per month

function daysSince(dateMs) {
  return Math.floor((Date.now() - dateMs) / (1000 * 60 * 60 * 24));
}
function trialStatus(school) {
  if (school.subscribed) return { active: true, daysLeft: null };
  const used = daysSince(school.trialStart);
  const daysLeft = TRIAL_DAYS - used;
  return { active: daysLeft > 0, daysLeft };
}

const initialSchools = [
  {
    id: 1,
    schoolName: admin.school,
    adminName: "Existing Admin",
    loginId: admin.phone,
    password: "admin123",
    trialStart: Date.now() - 3 * 24 * 60 * 60 * 1000, // demo: trial started 3 days ago
    subscribed: false,
    studentCount: 45,
  },
];

export default function App() {
  // view: "main" | "studentLogin" | "studentDashboard"
  const [view, setView] = useState("main");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comingSoon, setComingSoon] = useState("");
  const [studentActivity, setStudentActivity] = useState(initialActivity);
  const [schools, setSchools] = useState(initialSchools);
  const [activeSchoolId, setActiveSchoolId] = useState(null);

  function updateSchool(id, changes) {
    setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }

  function handleLoginClick(key) {
    setComingSoon("");
    if (key === "student") {
      setView("studentLogin");
    } else if (key === "admin") {
      setView("adminLogin");
    } else if (key === "teacher") {
      setView("teacherLogin");
    } else if (key === "parent") {
      setView("parentLogin");
    } else {
      setComingSoon(loginOptions.find((o) => o.key === key).label);
    }
  }

  function handleSignupComplete(newSchool) {
    const id = schools.length ? Math.max(...schools.map((s) => s.id)) + 1 : 1;
    const school = { id, trialStart: Date.now(), subscribed: false, studentCount: 0, ...newSchool };
    setSchools((prev) => [...prev, school]);
    setActiveSchoolId(id);
    setView("adminDashboard");
  }

  if (view === "signup") {
    return <SignupScreen onBack={() => setView("main")} onComplete={handleSignupComplete} />;
  }

  if (view === "ownerLogin") {
    return (
      <LoginScreen
        title="Owner login"
        phoneOrEmail={phoneOrEmail}
        setPhoneOrEmail={setPhoneOrEmail}
        password={password}
        setPassword={setPassword}
        onLogin={() => setView("ownerDashboard")}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "ownerDashboard") {
    return (
      <OwnerDashboard
        schools={schools}
        onAddSchool={handleSignupComplete}
        onLogout={() => setView("main")}
      />
    );
  }

  if (view === "studentLogin") {
    return (
      <LoginScreen
        title="Student login"
        phoneOrEmail={phoneOrEmail}
        setPhoneOrEmail={setPhoneOrEmail}
        password={password}
        setPassword={setPassword}
        onLogin={() => setView("studentDashboard")}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "adminLogin") {
    return (
      <LoginScreen
        title="Admin / Principal login"
        phoneOrEmail={phoneOrEmail}
        setPhoneOrEmail={setPhoneOrEmail}
        password={password}
        setPassword={setPassword}
        onLogin={() => { setActiveSchoolId(schools[0].id); setView("adminDashboard"); }}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "adminDashboard") {
    const school = schools.find((s) => s.id === activeSchoolId) || schools[0];
    return (
      <AdminDashboard
        loginId={phoneOrEmail || school.loginId}
        school={school}
        onUpdateSchool={(changes) => updateSchool(school.id, changes)}
        onLogout={() => setView("main")}
      />
    );
  }

  if (view === "teacherLogin") {
    return (
      <LoginScreen
        title="Teacher login"
        phoneOrEmail={phoneOrEmail}
        setPhoneOrEmail={setPhoneOrEmail}
        password={password}
        setPassword={setPassword}
        onLogin={() => setView("teacherDashboard")}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "teacherDashboard") {
    return <TeacherApp loginId={phoneOrEmail || teacherInfo.phone} onLogout={() => setView("main")} />;
  }

  if (view === "parentLogin") {
    return (
      <LoginScreen
        title="Parent login"
        phoneOrEmail={phoneOrEmail}
        setPhoneOrEmail={setPhoneOrEmail}
        password={password}
        setPassword={setPassword}
        onLogin={() => setView("parentDashboard")}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "parentDashboard") {
    return <ParentApp loginId={phoneOrEmail || parentInfo.phone} onLogout={() => setView("main")} />;
  }

  if (view === "studentDashboard") {
    return <StudentDashboard activity={studentActivity} setActivity={setStudentActivity} onLogout={() => setView("main")} />;
  }

  return (
    <MainPage
      loginOptions={loginOptions}
      onLoginClick={handleLoginClick}
      comingSoon={comingSoon}
      onGetStarted={() => setView("signup")}
      onOwnerLogin={() => setView("ownerLogin")}
    />
  );
}

function MainPage({ loginOptions, onLoginClick, comingSoon, onGetStarted, onOwnerLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans }}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
          <GraduationCap size={30} color={colors.primary} />
          <span style={{ fontSize: 26, fontWeight: 800, color: colors.ink }}>MyEdu</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            width: "100%",
            maxWidth: 360,
            marginBottom: 20,
          }}
        >
          {loginOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onLoginClick(opt.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                background: colors.card,
                border: `1px solid ${colors.bgSoft}`,
                borderRadius: 14,
                padding: "22px 12px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(45,125,210,0.10)",
              }}
            >
              <opt.icon size={26} color={colors.primary} />
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {comingSoon && (
          <div style={{ fontSize: 12, color: colors.primaryDark, marginBottom: 20, fontStyle: "italic" }}>
            {comingSoon} isn't built yet in this prototype — student login is ready to try.
          </div>
        )}

        <button
          style={{
            background: colors.primaryDark,
            color: "#fff",
            border: "none",
            padding: "14px 40px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
        <div style={{ fontSize: 12, color: colors.inkSoft, marginTop: 10 }}>New here? Tap to create your account</div>
      </div>

      <div style={{ background: "#fff", padding: "50px 20px 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.ink, marginBottom: 10, textAlign: "center" }}>
            About us
          </h2>
          <p style={{ fontSize: 14, color: colors.inkSoft, textAlign: "center", lineHeight: 1.6, marginBottom: 30 }}>
            [Company description goes here — who you are and what your team does.]
          </p>

          <PlaceholderPhoto label="Company / team photo" />

          <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.ink, margin: "36px 0 10px", textAlign: "center" }}>
            About the app
          </h2>
          <p style={{ fontSize: 14, color: colors.inkSoft, textAlign: "center", lineHeight: 1.6, marginBottom: 30 }}>
            [App description goes here — what MyEdu does for schools, teachers, and parents.]
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <PlaceholderPhoto label="App screenshot 1" />
            <PlaceholderPhoto label="App screenshot 2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPhoto({ label }) {
  return (
    <div
      style={{
        background: colors.bgSoft,
        border: `1px dashed ${colors.primary}`,
        borderRadius: 12,
        height: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: colors.primaryDark,
      }}
    >
      <ImageIcon size={26} />
      <span style={{ fontSize: 12 }}>{label}</span>
    </div>
  );
}

function LoginScreen({ title = "Student login", phoneOrEmail, setPhoneOrEmail, password, setPassword, onLogin, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: sans,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 20, left: 20,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, color: colors.inkSoft, fontSize: 13,
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 30 }}>
        <GraduationCap size={28} color={colors.primary} />
        <span style={{ fontSize: 22, fontWeight: 800, color: colors.ink }}>MyEdu</span>
      </div>

      <div
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 4px 14px rgba(45,125,210,0.10)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.ink, marginBottom: 20, textAlign: "center" }}>
          {title}
        </h2>

        <label style={{ fontSize: 13, color: colors.inkSoft }}>Phone number or email</label>
        <input
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
          placeholder="98765 43210 or you@email.com"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${colors.bgSoft}`,
            margin: "6px 0 16px",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontSize: 13, color: colors.inkSoft }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${colors.bgSoft}`,
            margin: "6px 0 22px",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            background: colors.primaryDark,
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

function StudentDashboard({ activity, setActivity, onLogout }) {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans, padding: 16, boxSizing: "border-box" }}>
      {page !== "sciencelab" && (
        <StudentHeader
          onHome={() => setPage("home")}
          onActivity={() => setPage("activity")}
          onProfile={() => setPage("profile")}
        />
      )}

      {page === "home" && (
        <StudentHomePage
          onAttendance={() => setPage("attendance")}
          onLearn={() => setPage("learn")}
          onMCQ={() => setPage("mcq")}
          onScienceLab={() => setPage("sciencelab")}
        />
      )}

      {page === "attendance" && <StudentAttendancePage onBack={() => setPage("home")} />}

      {page === "learn" && <StudentLearnPage onBack={() => setPage("home")} />}

      {page === "mcq" && (
        <StudentMCQPage onBack={() => setPage("home")} activity={activity} setActivity={setActivity} />
      )}

      {page === "activity" && <StudentActivityPage onBack={() => setPage("home")} activity={activity} />}

      {page === "sciencelab" && <ScienceLab3D onExit={() => setPage("home")} />}

      {page === "profile" && <StudentProfilePage onBack={() => setPage("home")} onLogout={onLogout} />}
    </div>
  );
}

function StudentHeader({ onHome, onActivity, onProfile }) {
  return (
    <div
      style={{
        background: colors.card, borderRadius: 14, padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, boxShadow: "0 4px 14px rgba(45,125,210,.08)", position: "relative",
      }}
    >
      <button onClick={onActivity} style={studentHeaderButton}>
        <History size={19} color={colors.primaryDark} />
        Activity
      </button>

      <button onClick={onHome} style={{ ...studentHeaderButton, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <GraduationCap size={23} color={colors.primary} />
        <b style={{ color: colors.ink, fontSize: 18 }}>MyEdu</b>
      </button>

      <button onClick={onProfile} style={studentHeaderButton}>
        <User size={19} color={colors.primaryDark} />
        Profile
      </button>
    </div>
  );
}

function StudentHomePage({ onAttendance, onLearn, onMCQ, onScienceLab }) {
  return (
    <div style={{ maxWidth: 850, margin: "auto" }}>
      <div style={{ ...studentCardStyle, background: "linear-gradient(135deg,#FFFFFF,#D6EBFF)" }}>
        <div style={{ fontSize: 13, color: colors.inkSoft }}>Welcome back 👋</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: colors.ink }}>{student.name}</div>
        <div style={{ fontSize: 12, color: colors.inkSoft }}>{student.standard} • {student.school}</div>
      </div>

      <div style={studentCardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Bell size={20} color={colors.primary} />
          <b style={{ color: colors.ink }}>School Notices</b>
        </div>
        <StudentNotice title="Half Yearly Examination" text="Half yearly examination will begin from 15 September 2026." />
        <StudentNotice title="Parent-Teacher Meeting" text="PTM is scheduled for 20 September at 10:00 AM." />
      </div>

      <StudentDashboardOption number="1" icon={<CalendarDays size={24} />} title="School Attendance" text="Check your daily school attendance." onClick={onAttendance} />
      <StudentDashboardOption number="2" icon={<BookOpen size={24} />} title="Learn" text="Study subjects, chapters and notes." onClick={onLearn} />
      <StudentDashboardOption number="3" icon={<ClipboardCheck size={24} />} title="MCQ Practice" text="Practice 100+ chapter-wise MCQs." onClick={onMCQ} />
      <StudentDashboardOption number="4" icon={<Atom size={24} />} title="3D Science Lab" text="Physics, Chemistry & Biology practicals in interactive 3D." onClick={onScienceLab} />
    </div>
  );
}

function StudentMCQPage({ onBack, activity, setActivity }) {
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState(null);

  if (result) {
    return <StudentPerformanceTracker result={result} onDone={onBack} />;
  }

  if (chapter) {
    const questions = mcqDatabase[chapter] || [];

    if (questions.length === 0) {
      return (
        <StudentPage title={chapter} onBack={() => setChapter(null)}>
          <div style={studentCardStyle}>MCQs for this chapter will be added soon.</div>
        </StudentPage>
      );
    }

    const currentQuestion = questions[questionIndex];
    const selectedAnswer = answers[currentQuestion.id];
    const isLast = questionIndex === questions.length - 1;

    const goNext = () => { if (!isLast) setQuestionIndex(questionIndex + 1); };
    const goBack = () => { if (questionIndex > 0) setQuestionIndex(questionIndex - 1); };

    const submitMCQ = () => {
      let attempted = 0;
      let correct = 0;
      questions.forEach((q) => {
        const selected = answers[q.id];
        if (selected !== undefined && selected !== null) {
          attempted++;
          if (selected === q.answer) correct++;
        }
      });
      const wrong = attempted - correct;
      const unattempted = questions.length - attempted;
      const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
      const resultData = {
        subject, chapter, total: questions.length, attempted, correct, wrong, unattempted, accuracy,
        date: new Date().toLocaleDateString("en-IN"),
      };
      setActivity((prev) => ({ ...prev, mcqAttempts: [...prev.mcqAttempts, resultData] }));
      setResult(resultData);
    };

    return (
      <StudentPage title={`${chapter} - MCQ Practice`} onBack={() => { setChapter(null); setAnswers({}); setQuestionIndex(0); }}>
        <div style={{ ...studentCardStyle, padding: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.inkSoft }}>
            <span>Question {questionIndex + 1} / {questions.length}</span>
            <span>Attempted: {Object.keys(answers).length}</span>
          </div>
          <div style={{ height: 7, background: colors.bgSoft, borderRadius: 20, marginTop: 8, overflow: "hidden" }}>
            <div style={{ width: `${((questionIndex + 1) / questions.length) * 100}%`, height: "100%", background: colors.primary }} />
          </div>
        </div>

        <div style={studentCardStyle}>
          <div style={{ fontSize: 12, color: colors.primaryDark, fontWeight: 700, marginBottom: 10 }}>Question {questionIndex + 1}</div>
          <h3 style={{ fontSize: 17, color: colors.ink, lineHeight: 1.6, marginTop: 0 }}>{currentQuestion.question}</h3>

          {currentQuestion.options.map((option, index) => {
            const selected = selectedAnswer === index;
            return (
              <button
                key={index}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }))}
                style={{
                  width: "100%", padding: 14, marginTop: 10, borderRadius: 10,
                  border: selected ? `2px solid ${colors.primary}` : `1px solid ${colors.bgSoft}`,
                  background: selected ? colors.bgSoft : "#fff",
                  textAlign: "left", cursor: "pointer", color: colors.ink, fontSize: 14,
                }}
              >
                <b>{String.fromCharCode(65 + index)}.</b> {option}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <button onClick={goBack} disabled={questionIndex === 0} style={{ ...studentSecondaryButton, opacity: questionIndex === 0 ? 0.45 : 1 }}>
            <ArrowLeft size={17} /> Back
          </button>

          {!isLast ? (
            <button onClick={goNext} style={studentPrimarySmallButton}>
              Next <ChevronRight size={17} />
            </button>
          ) : (
            <button onClick={submitMCQ} style={studentSubmitButton}>
              Submit <CheckCircle2 size={17} />
            </button>
          )}
        </div>
      </StudentPage>
    );
  }

  if (subject) {
    return (
      <StudentPage title={`${subject} - MCQ`} onBack={() => setSubject(null)}>
        {subjects[subject].map((chapterName) => {
          const count = mcqDatabase[chapterName]?.length || 100;
          return (
            <StudentListButton
              key={chapterName}
              icon={<ClipboardCheck size={20} />}
              title={chapterName}
              subtitle={`${count}+ MCQs`}
              onClick={() => { setChapter(chapterName); setQuestionIndex(0); setAnswers({}); setResult(null); }}
            />
          );
        })}
      </StudentPage>
    );
  }

  return (
    <StudentPage title="MCQ Practice" onBack={onBack}>
      <div style={studentCardStyle}>
        <div style={{ fontSize: 13, color: colors.inkSoft }}>Practice chapter-wise MCQs</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: colors.ink, marginTop: 4 }}>100+ MCQs per chapter</div>
      </div>
      {Object.keys(subjects).map((subjectName) => (
        <StudentListButton key={subjectName} icon={<ClipboardCheck size={20} />} title={subjectName} onClick={() => setSubject(subjectName)} />
      ))}
    </StudentPage>
  );
}

function StudentPerformanceTracker({ result, onDone }) {
  return (
    <StudentPage title="Performance Tracker" onBack={onDone}>
      <div style={{ ...studentCardStyle, textAlign: "center", background: "linear-gradient(135deg,#FFFFFF,#D6EBFF)" }}>
        <Trophy size={42} color={colors.primary} />
        <div style={{ fontSize: 14, color: colors.inkSoft, marginTop: 8 }}>{result.chapter}</div>
        <div style={{ fontSize: 38, fontWeight: 900, color: colors.primaryDark, marginTop: 5 }}>{result.accuracy}%</div>
        <div style={{ fontSize: 12, color: colors.inkSoft }}>Accuracy</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        <StudentPerformanceBox title="Total MCQs" value={result.total} icon={<ClipboardCheck size={20} />} />
        <StudentPerformanceBox title="Attempted" value={result.attempted} icon={<Target size={20} />} />
        <StudentPerformanceBox title="Correct" value={result.correct} icon={<CheckCircle2 size={20} />} type="green" />
        <StudentPerformanceBox title="Wrong" value={result.wrong} icon={<XCircle size={20} />} type="red" />
        <StudentPerformanceBox title="Unattempted" value={result.unattempted} icon={<Clock3 size={20} />} />
        <StudentPerformanceBox title="Accuracy" value={`${result.accuracy}%`} icon={<Trophy size={20} />} />
      </div>

      <div style={studentCardStyle}>
        <b style={{ color: colors.ink }}>Performance Summary</b>
        <div style={{ marginTop: 14, fontSize: 13, color: colors.inkSoft, lineHeight: 1.8 }}>
          You attempted <b>{result.attempted}</b> out of <b>{result.total}</b> MCQs.<br />
          Correct answers: <b style={{ color: colors.green }}>{result.correct}</b><br />
          Wrong answers: <b style={{ color: colors.red }}>{result.wrong}</b><br />
          Unattempted: <b>{result.unattempted}</b>
        </div>
      </div>

      <button onClick={onDone} style={{ ...studentPrimaryButton, marginTop: 5 }}>
        Back to Dashboard
      </button>
    </StudentPage>
  );
}

function StudentPerformanceBox({ title, value, icon, type }) {
  let iconColor = colors.primaryDark;
  if (type === "green") iconColor = colors.green;
  if (type === "red") iconColor = colors.red;

  return (
    <div style={{ ...studentCardStyle, marginBottom: 0, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: colors.inkSoft }}>{title}</span>
        {React.cloneElement(icon, { color: iconColor })}
      </div>
      <div style={{ fontSize: 23, fontWeight: 800, color: colors.ink, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function StudentActivityPage({ onBack, activity }) {
  return (
    <StudentPage title="My Activity" onBack={onBack}>
      <div style={studentCardStyle}>
        <StudentSectionTitle icon={<Clock3 size={19} />} title="App Opened" />
        <div style={{ fontSize: 30, fontWeight: 800, color: colors.primaryDark }}>{activity.daysOpened.length} days</div>
        <div style={{ display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" }}>
          {activity.daysOpened.map((day) => (
            <span key={day} style={studentPillStyle}>Sep {day}</span>
          ))}
        </div>
      </div>

      <StudentActivityList title="Subjects Viewed" items={activity.subjectsViewed} icon={<BookOpen size={18} />} />
      <StudentActivityList title="Chapters Viewed" items={activity.chaptersViewed} icon={<BookOpen size={18} />} />

      <div style={studentCardStyle}>
        <StudentSectionTitle icon={<ClipboardCheck size={19} />} title="MCQ Performance History" />
        {activity.mcqAttempts.length === 0 ? (
          <div style={{ fontSize: 13, color: colors.inkSoft }}>No MCQ attempts yet.</div>
        ) : (
          activity.mcqAttempts.slice().reverse().map((attempt, index) => (
            <div key={index} style={{ padding: "13px 0", borderBottom: `1px solid ${colors.bgSoft}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b style={{ color: colors.ink, fontSize: 13 }}>{attempt.chapter}</b>
                  <div style={{ fontSize: 10, color: colors.inkSoft, marginTop: 3 }}>{attempt.subject}</div>
                </div>
                <b style={{ color: colors.primaryDark, fontSize: 16 }}>{attempt.accuracy}%</b>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 9, fontSize: 11 }}>
                <span style={{ color: colors.inkSoft }}>Attempted: {attempt.attempted}</span>
                <span style={{ color: colors.green }}>Correct: {attempt.correct}</span>
                <span style={{ color: colors.red }}>Wrong: {attempt.wrong}</span>
              </div>
              <div style={{ fontSize: 10, color: colors.inkSoft, marginTop: 5 }}>{attempt.date}</div>
            </div>
          ))
        )}
      </div>
    </StudentPage>
  );
}

function StudentAttendancePage({ onBack }) {
  const present = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18];
  const absent = [5, 12];
  const totalWorkingDays = 16;
  const percentage = Math.round((present.length / totalWorkingDays) * 100);

  return (
    <StudentPage title="School Attendance" onBack={onBack}>
      <div style={studentCardStyle}>
        <b style={{ color: colors.ink }}>September 2026</b>
        <div style={{ marginTop: 18 }}>
          <StudentAttendanceCalendar present={present} absent={absent} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
          <StudentPerformanceBox title="Monthly Attendance" value={`${percentage}%`} icon={<CheckCircle2 size={20} />} type="green" />
          <StudentPerformanceBox title="Absent" value={absent.length} icon={<XCircle size={20} />} type="red" />
        </div>
      </div>

      <div style={studentCardStyle}>
        <div style={{ fontSize: 12, color: colors.inkSoft }}>Overall School Attendance</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: colors.primaryDark }}>87.5%</div>
        <div style={{ height: 8, background: colors.bgSoft, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ width: "87.5%", height: "100%", background: colors.primary }} />
        </div>
      </div>
    </StudentPage>
  );
}

function StudentAttendanceCalendar({ present, absent }) {
  const days = [];
  days.push(null);
  days.push(null);
  for (let i = 1; i <= 30; i++) days.push(i);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 7 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, color: colors.inkSoft }}>{x}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {days.map((day, i) => {
          const isPresent = present.includes(day);
          const isAbsent = absent.includes(day);
          return (
            <div
              key={i}
              style={{
                height: 34, borderRadius: 9, display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: 12, color: isPresent || isAbsent ? "#fff" : colors.ink,
                background: isPresent ? colors.primary : isAbsent ? colors.red : "transparent",
              }}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentLearnPage({ onBack }) {
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);

  if (chapter) {
    return (
      <StudentPage title={chapter} onBack={() => setChapter(null)}>
        <div style={studentCardStyle}>
          <StudentSectionTitle icon={<BookOpen size={19} />} title="Notes" />
          <div style={{ whiteSpace: "pre-line", color: colors.inkSoft, lineHeight: 1.8, fontSize: 14 }}>
            {notes[chapter] || `Complete notes for ${chapter} will appear here.`}
          </div>
        </div>
      </StudentPage>
    );
  }

  if (subject) {
    return (
      <StudentPage title={subject} onBack={() => setSubject(null)}>
        {subjects[subject].map((chapterName) => (
          <StudentListButton key={chapterName} icon={<BookOpen size={20} />} title={chapterName} onClick={() => setChapter(chapterName)} />
        ))}
      </StudentPage>
    );
  }

  return (
    <StudentPage title="Learn" onBack={onBack}>
      {Object.keys(subjects).map((subjectName) => (
        <StudentListButton key={subjectName} icon={<BookOpen size={20} />} title={subjectName} onClick={() => setSubject(subjectName)} />
      ))}
    </StudentPage>
  );
}

function StudentProfilePage({ onBack, onLogout }) {
  return (
    <StudentPage title="My Profile" onBack={onBack}>
      <div style={studentCardStyle}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: colors.bgSoft, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <User size={40} color={colors.primary} />
          </div>
        </div>
        <StudentProfileRow title="Name" value={student.name} />
        <StudentProfileRow title="Phone Number" value={student.phone} />
        <StudentProfileRow title="Student ID" value={student.studentId} />
        <StudentProfileRow title="Standard" value={student.standard} />
        <StudentProfileRow title="School Name" value={student.school} />
        <button
          onClick={onLogout}
          style={{
            width: "100%", marginTop: 20, padding: 12, borderRadius: 10, border: "none",
            background: "#FFE5E5", color: colors.red, fontWeight: 700, cursor: "pointer",
            display: "flex", justifyContent: "center", alignItems: "center", gap: 7,
          }}
        >
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </StudentPage>
  );
}

function StudentPage({ title, onBack, children }) {
  return (
    <div style={{ maxWidth: 850, margin: "auto" }}>
      <button onClick={onBack} style={{ border: "none", background: "transparent", display: "flex", alignItems: "center", gap: 6, color: colors.primaryDark, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2 style={{ color: colors.ink, fontSize: 21, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function StudentListButton({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{ ...studentCardStyle, width: "100%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: colors.bgSoft, display: "flex", justifyContent: "center", alignItems: "center", color: colors.primaryDark }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: colors.ink, fontWeight: 600, fontSize: 14 }}>{title}</div>
        {subtitle && <div style={{ color: colors.inkSoft, fontSize: 11, marginTop: 3 }}>{subtitle}</div>}
      </div>
      <ChevronRight size={18} color={colors.primary} />
    </button>
  );
}

function StudentDashboardOption({ number, icon, title, text, onClick }) {
  return (
    <button onClick={onClick} style={{ ...studentCardStyle, width: "100%", border: "none", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left" }}>
      <div style={{ minWidth: 44, height: 44, borderRadius: 12, background: colors.bgSoft, display: "flex", justifyContent: "center", alignItems: "center", color: colors.primaryDark, fontWeight: 800 }}>
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: colors.ink }}>
          {icon}
          <b>{title}</b>
        </div>
        <div style={{ fontSize: 12, color: colors.inkSoft, marginTop: 5 }}>{text}</div>
      </div>
      <ChevronRight color={colors.primary} />
    </button>
  );
}

function StudentActivityList({ title, items, icon }) {
  return (
    <div style={studentCardStyle}>
      <StudentSectionTitle icon={icon} title={title} />
      {items.map((item) => (
        <div key={item} style={{ padding: "9px 0", borderBottom: `1px solid ${colors.bgSoft}`, fontSize: 13, color: colors.ink }}>
          {item}
        </div>
      ))}
    </div>
  );
}

function StudentSectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
      {icon}
      <b style={{ color: colors.ink }}>{title}</b>
    </div>
  );
}

function StudentProfileRow({ title, value }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: `1px solid ${colors.bgSoft}` }}>
      <div style={{ fontSize: 11, color: colors.inkSoft }}>{title}</div>
      <div style={{ fontSize: 14, color: colors.ink, fontWeight: 600, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function StudentNotice({ title, text }) {
  return (
    <div style={{ background: colors.bg, padding: 12, borderRadius: 10, marginBottom: 8 }}>
      <b style={{ fontSize: 13, color: colors.ink }}>{title}</b>
      <div style={{ fontSize: 12, color: colors.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

const studentCardStyle = { background: colors.card, borderRadius: 14, padding: 16, boxShadow: "0 4px 14px rgba(45,125,210,.09)", marginBottom: 12 };
const studentPrimaryButton = { width: "100%", background: colors.primaryDark, color: "#fff", border: "none", padding: 12, borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer" };
const studentPrimarySmallButton = { background: colors.primaryDark, color: "#fff", border: "none", padding: "11px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 };
const studentSecondaryButton = { background: "#fff", color: colors.primaryDark, border: `1px solid ${colors.bgSoft}`, padding: "11px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 };
const studentSubmitButton = { background: colors.green, color: "#fff", border: "none", padding: "11px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 };
const studentHeaderButton = { border: "none", background: "transparent", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: colors.ink, fontSize: 12, fontWeight: 600 };
const studentPillStyle = { background: colors.bgSoft, color: colors.primaryDark, padding: "5px 9px", borderRadius: 999, fontSize: 11 };


// ============ SHARED DASHBOARD HELPERS ============

function ScreenHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <button
        onClick={onBack}
        style={{ background: colors.card, border: `1px solid ${colors.bgSoft}`, borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}
      >
        <ArrowLeft size={18} color={colors.ink} />
      </button>
      <span style={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>{title}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0" }}>
      <span style={{ color: colors.inkSoft }}>{label}</span>
      <span style={{ color: colors.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function MenuRow({ number, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        background: colors.card, border: `1px solid ${colors.bgSoft}`, borderRadius: 14,
        padding: "16px 16px", marginBottom: 12, cursor: "pointer",
        boxShadow: "0 4px 14px rgba(45,125,210,0.10)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary, width: 18 }}>{number}.</span>
      <Icon size={20} color={colors.primary} />
      <span style={{ flex: 1, textAlign: "left", fontSize: 15, fontWeight: 600, color: colors.ink }}>{label}</span>
      <ChevronRight size={18} color={colors.inkSoft} />
    </button>
  );
}

// ============ ADMIN / PRINCIPAL DASHBOARD ============

const menuItems = [
  { key: "graph", icon: BarChart3, label: "Attendance graph" },
  { key: "todayData", icon: ClipboardList, label: "Today's student data" },
  { key: "teacherReg", icon: UserPlus, label: "Teacher registration" },
  { key: "teacherDetails", icon: Users2, label: "Teacher details" },
  { key: "noticeStudents", icon: Bell, label: "Notice for students" },
  { key: "noticeTeachers", icon: MessageSquare, label: "Notice for teachers" },
  { key: "announceParents", icon: Megaphone, label: "Announcement for parents" },
];

function AdminDashboard({ loginId, onLogout }) {
  const [screen, setScreen] = useState("home"); // home | profile | <menu key> | classDetail | composeClass
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [composeFor, setComposeFor] = useState(null); // "students" | "parents"
  const [teachers, setTeachers] = useState([]);
  const [sentNotices, setSentNotices] = useState([]); // {audience, class, text, date}

  function openMenuItem(key) {
    setMenuOpen(false);
    setSelectedClass(null);
    setComposeFor(null);
    setScreen(key);
  }

  function sendNotice(audience, cls, text) {
    setSentNotices((prev) => [{ audience, class: cls, text, date: "3 Sept" }, ...prev]);
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans }}>
      {screen !== "profile" && (
        <AdminTopBar
          onMenu={() => setMenuOpen(true)}
          onProfile={() => setScreen("profile")}
        />
      )}

      {menuOpen && <AdminSideMenu onSelect={openMenuItem} onClose={() => setMenuOpen(false)} />}

      <div style={{ padding: 16 }}>
        {screen === "home" && (
          <div style={{ textAlign: "center", color: colors.inkSoft, fontSize: 13, marginTop: 60 }}>
            Tap the <Menu size={14} style={{ verticalAlign: "middle" }} /> menu (top-left) to open reports, teacher tools, and notices.
          </div>
        )}

        {screen === "profile" && (
          <AdminProfilePanel loginId={loginId} onClose={() => setScreen("home")} onLogout={onLogout} />
        )}

        {screen === "graph" && <AttendanceGraphScreen onBack={() => setScreen("home")} />}

        {screen === "todayData" && !selectedClass && (
          <ClassListScreen title="Today's student data" onBack={() => setScreen("home")} onSelectClass={setSelectedClass} />
        )}
        {screen === "todayData" && selectedClass && (
          <ClassDataDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />
        )}

        {screen === "teacherReg" && (
          <TeacherRegistrationScreen
            onBack={() => setScreen("home")}
            onSave={(t) => { setTeachers((prev) => [...prev, t]); setScreen("home"); }}
          />
        )}

        {screen === "teacherDetails" && (
          <TeacherDetailsScreen teachers={teachers} onBack={() => setScreen("home")} />
        )}

        {screen === "noticeStudents" && !selectedClass && (
          <ClassListScreen title="Notice for students" onBack={() => setScreen("home")} onSelectClass={setSelectedClass} />
        )}
        {screen === "noticeStudents" && selectedClass && (
          <ComposeScreen
            title={`Notice — Class ${selectedClass}`}
            onBack={() => setSelectedClass(null)}
            onSend={(text) => { sendNotice("students", selectedClass, text); setSelectedClass(null); setScreen("home"); }}
          />
        )}

        {screen === "noticeTeachers" && (
          <ComposeScreen
            title="Notice for all teachers"
            onBack={() => setScreen("home")}
            onSend={(text) => { sendNotice("teachers", null, text); setScreen("home"); }}
          />
        )}

        {screen === "announceParents" && !selectedClass && (
          <ClassListScreen title="Announcement for parents" onBack={() => setScreen("home")} onSelectClass={setSelectedClass} />
        )}
        {screen === "announceParents" && selectedClass && (
          <ComposeScreen
            title={`Announcement — Class ${selectedClass} parents`}
            onBack={() => setSelectedClass(null)}
            onSend={(text) => { sendNotice("parents", selectedClass, text); setSelectedClass(null); setScreen("home"); }}
          />
        )}
      </div>
    </div>
  );
}

function AdminTopBar({ onMenu, onProfile }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 0" }}>
      <button onClick={onMenu} style={{ background: colors.card, border: `1px solid ${colors.bgSoft}`, borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
        <Menu size={20} color={colors.ink} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <GraduationCap size={20} color={colors.primary} />
        <span style={{ fontSize: 15, fontWeight: 800, color: colors.ink }}>MyEdu</span>
      </div>
      <button onClick={onProfile} style={{ width: 38, height: 38, borderRadius: "50%", background: colors.card, border: `1px solid ${colors.bgSoft}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <User size={18} color={colors.primary} />
      </button>
    </div>
  );
}

function AdminSideMenu({ onSelect, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.35)", zIndex: 10 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 260, height: "100%", background: "#fff", padding: 16, boxShadow: "2px 0 20px rgba(0,0,0,0.12)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: colors.ink }}>Principal menu</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color={colors.ink} />
          </button>
        </div>
        {menuItems.map((m, i) => (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", borderTop: i > 0 ? `1px solid ${colors.bgSoft}` : "none",
              padding: "13px 4px", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 12, color: colors.primary, fontWeight: 700, width: 16 }}>{i + 1}.</span>
            <m.icon size={17} color={colors.primary} />
            <span style={{ fontSize: 14, color: colors.ink, fontWeight: 600 }}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminProfilePanel({ loginId, onClose, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>Profile</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color={colors.ink} />
        </button>
      </div>
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <InfoRow label="User ID" value={loginId} />
        <InfoRow label="School" value={admin.school} />
      </div>
      <button
        onClick={onLogout}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#fff", color: "#C0392B", border: `1px solid ${colors.bgSoft}`,
          padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}

function AttendanceGraphScreen({ onBack }) {
  return (
    <div>
      <ScreenHeader title="Attendance graph" onBack={onBack} />
      <div style={{ fontSize: 12, color: colors.inkSoft, marginBottom: 10 }}>Students present today, by class</div>
      <div style={{ background: colors.card, borderRadius: 14, padding: 16, height: 320, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={todayClassData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.bgSoft} />
            <XAxis dataKey="class" tickFormatter={(c) => `C${c}`} tick={{ fontSize: 11, fill: colors.inkSoft }} />
            <YAxis tick={{ fontSize: 11, fill: colors.inkSoft }} />
            <Tooltip formatter={(v) => [v, "Present"]} labelFormatter={(c) => `Class ${c}`} />
            <Bar dataKey="present" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ClassListScreen({ title, onBack, onSelectClass }) {
  return (
    <div>
      <ScreenHeader title={title} onBack={onBack} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {classesList.map((c) => (
          <button
            key={c}
            onClick={() => onSelectClass(c)}
            style={{
              background: colors.card, border: `1px solid ${colors.bgSoft}`, borderRadius: 12,
              padding: "16px 0", fontSize: 14, fontWeight: 700, color: colors.ink, cursor: "pointer",
            }}
          >
            Class {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClassDataDetail({ cls, onBack }) {
  const data = todayClassData.find((c) => c.class === cls);
  return (
    <div>
      <ScreenHeader title={`Class ${cls} — today`} onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <InfoRow label="Total students" value={data.total} />
        <InfoRow label="Present" value={data.present} />
        <InfoRow label="Absent" value={data.absent} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontSize: 12, color: colors.inkSoft }}>Attendance percentage</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: colors.primaryDark }}>{data.percent}%</div>
        </div>
      </div>
    </div>
  );
}

function TeacherRegistrationScreen({ onBack, onSave }) {
  const [form, setForm] = useState({ name: "", std: "", phone: "", email: "", subject: "", password: "" });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim()) || !form.password.trim()) return;
    onSave({ ...form, school: admin.school, loginId: form.phone || form.email });
  }

  return (
    <div>
      <ScreenHeader title="Teacher registration" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <FormField label="Teacher name" value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. Mrs. Fatima Sheikh" />
        <FormField label="Class / std" value={form.std} onChange={(v) => update("std", v)} placeholder="e.g. Class 6" />
        <FormField label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} placeholder="98765 43210" />
        <FormField label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="teacher@email.com" />
        <FormField label="School name" value={admin.school} disabled />
        <FormField label="Subject" value={form.subject} onChange={(v) => update("subject", v)} placeholder="e.g. Mathematics" />
        <FormField label="Set login password" value={form.password} onChange={(v) => update("password", v)} placeholder="Password for teacher login" type="password" />
        <div style={{ fontSize: 11, color: colors.inkSoft, margin: "6px 0 14px" }}>
          The phone number or email entered above becomes this teacher's login ID.
        </div>
        <button
          onClick={handleSave}
          style={{ width: "100%", background: colors.primaryDark, color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Save teacher
        </button>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: colors.inkSoft }}>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8,
          border: `1px solid ${colors.bgSoft}`, marginTop: 4, fontSize: 13,
          boxSizing: "border-box", background: disabled ? colors.bgSoft : "#fff", color: colors.ink,
        }}
      />
    </div>
  );
}

function TeacherDetailsScreen({ teachers, onBack }) {
  return (
    <div>
      <ScreenHeader title="Teacher details" onBack={onBack} />
      {teachers.length === 0 ? (
        <div style={{ fontSize: 13, color: colors.inkSoft, textAlign: "center", marginTop: 40 }}>
          No teachers registered yet. Use "Teacher registration" to add one.
        </div>
      ) : (
        teachers.map((t, i) => (
          <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>{t.name}</div>
            <div style={{ fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>{t.std} · {t.subject}</div>
            <div style={{ fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>Login ID: {t.loginId}</div>
          </div>
        ))
      )}
    </div>
  );
}

function ComposeScreen({ title, onBack, onSend }) {
  const [text, setText] = useState("");
  return (
    <div>
      <ScreenHeader title={title} onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          rows={5}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${colors.bgSoft}`, fontSize: 13, boxSizing: "border-box", fontFamily: sans, resize: "vertical" }}
        />
        <button
          onClick={() => text.trim() && onSend(text.trim())}
          style={{
            width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: colors.primaryDark, color: "#fff", border: "none", padding: "12px", borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          <Send size={15} /> Send
        </button>
      </div>
    </div>
  );
}

// ============ TEACHER DASHBOARD ============

const teacherMenuItems = [
  { key: "principalAnnouncements", icon: Megaphone, label: "Principal announcements" },
  { key: "addStudent", icon: UserPlus, label: "Add students" },
  { key: "deleteStudents", icon: Trash2, label: "Delete students" },
  { key: "presentData", icon: ClipboardList, label: "Checking student present data" },
  { key: "addParent", icon: Users2, label: "Add parents" },
  { key: "announceParents", icon: Bell, label: "Announcement for parents" },
];

function TeacherApp({ loginId, onLogout }) {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [students, setStudents] = useState(initialTeacherStudents);
  const [parents, setParents] = useState([]);
  const [sentParentAnnouncements, setSentParentAnnouncements] = useState([]);
  const [selectedStudentRoll, setSelectedStudentRoll] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [lateResult, setLateResult] = useState(null);

  function openMenuItem(key) {
    setMenuOpen(false);
    setSelectedStudentRoll(null);
    setScreen(key);
  }

  function addStudent(data) {
    const nextRoll = students.length ? Math.max(...students.map((s) => s.roll)) + 1 : 1;
    setStudents((prev) => [...prev, { roll: nextRoll, ...data, presentToday: null, lateToday: false }]);
    setScreen("home");
  }

  function deleteStudent(roll) {
    setStudents((prev) => prev.filter((s) => s.roll !== roll));
    setParents((prev) => prev.filter((p) => p.studentRoll !== roll));
    setConfirmDeleteOpen(false);
    setSelectedStudentRoll(null);
  }

  function addParent(data) {
    setParents((prev) => [...prev, data]);
    setScreen("home");
  }

  function submitAttendance(absentRolls) {
    setStudents((prev) => prev.map((s) => ({ ...s, presentToday: !absentRolls.includes(s.roll) })));
    const total = students.length;
    const absent = absentRolls.length;
    const present = total - absent;
    setAttendanceSummary({ total, present, absent, percent: total ? Math.round((present / total) * 100) : 0 });
    setScreen("attendanceDone");
  }

  function markLate(phone) {
    const match = students.find((s) => s.phone === phone.trim());
    if (!match) {
      setLateResult({ found: false });
      return;
    }
    setStudents((prev) => prev.map((s) => (s.roll === match.roll ? { ...s, lateToday: true, presentToday: true } : s)));
    setLateResult({ found: true, name: match.name, roll: match.roll });
  }

  const selectedStudent = students.find((s) => s.roll === selectedStudentRoll);

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans }}>
      {screen !== "profile" && (
        <AdminTopBar onMenu={() => setMenuOpen(true)} onProfile={() => setScreen("profile")} />
      )}

      {menuOpen && <TeacherSideMenu onSelect={openMenuItem} onClose={() => setMenuOpen(false)} />}

      <div style={{ padding: 16 }}>
        {screen === "home" && (
          <div>
            <MenuRow number={1} icon={CheckSquare} label="Attendance" onClick={() => setScreen("attendance")} />
            <MenuRow number={2} icon={Clock} label="Late comers" onClick={() => { setLateResult(null); setScreen("lateComers"); }} />
            <MenuRow number={3} icon={Megaphone} label="Announcements" onClick={() => setScreen("principalAnnouncements")} />
          </div>
        )}

        {screen === "profile" && (
          <TeacherProfilePanel loginId={loginId} onClose={() => setScreen("home")} onLogout={onLogout} />
        )}

        {screen === "principalAnnouncements" && (
          <PrincipalAnnouncementsFeed onBack={() => setScreen("home")} />
        )}

        {screen === "addStudent" && (
          <AddStudentScreen onBack={() => setScreen("home")} onSave={addStudent} />
        )}

        {screen === "deleteStudents" && !selectedStudentRoll && (
          <DeleteStudentsListScreen students={students} onBack={() => setScreen("home")} onSelect={setSelectedStudentRoll} />
        )}
        {screen === "deleteStudents" && selectedStudentRoll && selectedStudent && (
          <DeleteStudentDetailScreen
            student={selectedStudent}
            onBack={() => setSelectedStudentRoll(null)}
            onDeleteClick={() => setConfirmDeleteOpen(true)}
          />
        )}

        {screen === "presentData" && (
          <PresentDataScreen students={students} onBack={() => setScreen("home")} />
        )}

        {screen === "addParent" && (
          <AddParentScreen students={students} onBack={() => setScreen("home")} onSave={addParent} />
        )}

        {screen === "announceParents" && (
          <ComposeScreen
            title={`Announcement — ${teacherInfo.std} parents only`}
            onBack={() => setScreen("home")}
            onSend={(text) => { setSentParentAnnouncements((prev) => [{ text, date: "3 Sept" }, ...prev]); setScreen("home"); }}
          />
        )}

        {screen === "attendance" && (
          <AttendanceMarkScreen students={students} onBack={() => setScreen("home")} onSubmit={submitAttendance} />
        )}
        {screen === "attendanceDone" && attendanceSummary && (
          <AttendanceDoneScreen summary={attendanceSummary} onBack={() => setScreen("home")} />
        )}

        {screen === "lateComers" && (
          <LateComersScreen onBack={() => setScreen("home")} onMark={markLate} result={lateResult} />
        )}
      </div>

      {confirmDeleteOpen && selectedStudent && (
        <ConfirmDeleteModal
          name={selectedStudent.name}
          onCancel={() => setConfirmDeleteOpen(false)}
          onConfirm={() => deleteStudent(selectedStudent.roll)}
        />
      )}
    </div>
  );
}

function TeacherSideMenu({ onSelect, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.35)", zIndex: 10 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 260, height: "100%", background: "#fff", padding: 16, boxShadow: "2px 0 20px rgba(0,0,0,0.12)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: colors.ink }}>Teacher menu</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color={colors.ink} />
          </button>
        </div>
        {teacherMenuItems.map((m, i) => (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", borderTop: i > 0 ? `1px solid ${colors.bgSoft}` : "none",
              padding: "13px 4px", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 12, color: colors.primary, fontWeight: 700, width: 16 }}>{i + 1}.</span>
            <m.icon size={17} color={colors.primary} />
            <span style={{ fontSize: 14, color: colors.ink, fontWeight: 600 }}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TeacherProfilePanel({ loginId, onClose, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>Profile</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color={colors.ink} />
        </button>
      </div>
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <InfoRow label="Name" value={teacherInfo.name} />
        <InfoRow label="User ID" value={loginId} />
        <InfoRow label="Class" value={teacherInfo.std} />
        <InfoRow label="Subject" value={teacherInfo.subject} />
      </div>
      <button
        onClick={onLogout}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#fff", color: "#C0392B", border: `1px solid ${colors.bgSoft}`,
          padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}

function PrincipalAnnouncementsFeed({ onBack }) {
  return (
    <div>
      <ScreenHeader title="Principal announcements" onBack={onBack} />
      {principalAnnouncementsDemo.map((n, i) => (
        <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
          <div style={{ fontSize: 13, color: colors.ink }}>{n.text}</div>
          <div style={{ fontSize: 11, color: colors.inkSoft, marginTop: 4 }}>{n.date}</div>
        </div>
      ))}
    </div>
  );
}

function AddStudentScreen({ onBack, onSave }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }
  function handleSave() {
    if (!form.name.trim() || !form.phone.trim() || !form.password.trim()) return;
    onSave(form);
  }
  return (
    <div>
      <ScreenHeader title="Add student" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <FormField label="Student name" value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. Aarav Mehta" />
        <FormField label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} placeholder="98765 00001" />
        <FormField label="Email ID" value={form.email} onChange={(v) => update("email", v)} placeholder="student@email.com" />
        <FormField label="Set login password" value={form.password} onChange={(v) => update("password", v)} placeholder="Password for student login" type="password" />
        <div style={{ fontSize: 11, color: colors.inkSoft, margin: "6px 0 14px" }}>
          The phone number becomes this student's login ID — they log in with this phone number and the password you set here.
        </div>
        <button
          onClick={handleSave}
          style={{ width: "100%", background: colors.primaryDark, color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function DeleteStudentsListScreen({ students, onBack, onSelect }) {
  return (
    <div>
      <ScreenHeader title={`Delete students (${students.length})`} onBack={onBack} />
      {students.length === 0 ? (
        <div style={{ fontSize: 13, color: colors.inkSoft, textAlign: "center", marginTop: 40 }}>No students added yet.</div>
      ) : (
        students.map((s) => (
          <button
            key={s.roll}
            onClick={() => onSelect(s.roll)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              background: colors.card, border: `1px solid ${colors.bgSoft}`, borderRadius: 12,
              padding: "12px 14px", marginBottom: 8, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 12, color: colors.inkSoft, width: 28 }}>#{s.roll}</span>
            <span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 600, color: colors.ink }}>{s.name}</span>
            <ChevronRight size={16} color={colors.inkSoft} />
          </button>
        ))
      )}
    </div>
  );
}

function DeleteStudentDetailScreen({ student, onBack, onDeleteClick }) {
  return (
    <div>
      <ScreenHeader title={`Roll #${student.roll}`} onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <InfoRow label="Name" value={student.name} />
        <InfoRow label="User ID (phone)" value={student.phone} />
        <InfoRow label="Email" value={student.email || "—"} />
        <InfoRow label="Password" value={student.password} />
      </div>
      <button
        onClick={onDeleteClick}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#E5484D", color: "#fff", border: "none", padding: "12px", borderRadius: 10,
          fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        <Trash2 size={16} /> Delete this student
      </button>
    </div>
  );
}

function ConfirmDeleteModal({ name, onCancel, onConfirm }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 320, width: "100%", textAlign: "center" }}>
        <AlertTriangle size={30} color="#E5484D" style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.ink, marginBottom: 6 }}>Are you sure you want to delete?</div>
        <div style={{ fontSize: 13, color: colors.inkSoft, marginBottom: 20 }}>{name} will be removed permanently.</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${colors.bgSoft}`, background: "#fff", color: colors.ink, cursor: "pointer", fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#E5484D", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function PresentDataScreen({ students, onBack }) {
  return (
    <div>
      <ScreenHeader title="Student present data" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.6fr 1fr", padding: "8px 12px", background: colors.surface || colors.bgSoft, fontSize: 11, color: colors.inkSoft }}>
          <span>Roll</span><span>Name</span><span>Status</span>
        </div>
        {students.map((s) => (
          <div key={s.roll} style={{ display: "grid", gridTemplateColumns: "0.6fr 1.6fr 1fr", padding: "10px 12px", borderTop: `1px solid ${colors.bgSoft}`, fontSize: 13, color: colors.ink, alignItems: "center" }}>
            <span>#{s.roll}</span>
            <span>{s.name}</span>
            <span style={{ color: s.presentToday === true ? "#16A34A" : s.presentToday === false ? "#E5484D" : colors.inkSoft, fontWeight: 600, fontSize: 12 }}>
              {s.presentToday === true ? (s.lateToday ? "Present (late)" : "Present") : s.presentToday === false ? "Absent" : "Not marked"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddParentScreen({ students, onBack, onSave }) {
  const [form, setForm] = useState({ studentRoll: students[0]?.roll || "", phone: "", email: "", password: "" });
  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }
  function handleSave() {
    if (!form.phone.trim() || !form.password.trim() || !form.studentRoll) return;
    onSave({ ...form, studentRoll: Number(form.studentRoll) });
  }
  return (
    <div>
      <ScreenHeader title="Add parent" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <label style={{ fontSize: 12, color: colors.inkSoft }}>Child</label>
        <select
          value={form.studentRoll}
          onChange={(e) => update("studentRoll", e.target.value)}
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${colors.bgSoft}`, marginTop: 4, marginBottom: 12, fontSize: 13, boxSizing: "border-box" }}
        >
          {students.map((s) => (
            <option key={s.roll} value={s.roll}>#{s.roll} — {s.name}</option>
          ))}
        </select>
        <FormField label="Parent phone number" value={form.phone} onChange={(v) => update("phone", v)} placeholder="98765 00099" />
        <FormField label="Parent email" value={form.email} onChange={(v) => update("email", v)} placeholder="parent@email.com" />
        <FormField label="Set login password" value={form.password} onChange={(v) => update("password", v)} placeholder="Password for parent login" type="password" />
        <button
          onClick={handleSave}
          style={{ width: "100%", background: colors.primaryDark, color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function AttendanceMarkScreen({ students, onBack, onSubmit }) {
  const [absentRolls, setAbsentRolls] = useState([]);
  function toggle(roll) {
    setAbsentRolls((prev) => (prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll]));
  }
  const present = students.length - absentRolls.length;
  return (
    <div>
      <ScreenHeader title={`Attendance — ${teacherInfo.std}`} onBack={onBack} />
      <div style={{ fontSize: 12, color: colors.inkSoft, marginBottom: 8 }}>
        Everyone starts marked present — tap a row to mark that student absent.
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto", border: `1px solid ${colors.bgSoft}`, borderRadius: 10, background: "#fff", marginBottom: 14 }}>
        {students.map((s) => {
          const absent = absentRolls.includes(s.roll);
          return (
            <div
              key={s.roll}
              onClick={() => toggle(s.roll)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderBottom: `1px solid ${colors.bgSoft}`, background: absent ? "#FDEEEC" : "transparent", cursor: "pointer",
              }}
            >
              <span style={{ width: 30, fontSize: 12, color: colors.inkSoft }}>#{s.roll}</span>
              <span style={{ flex: 1, fontSize: 14, color: colors.ink }}>{s.name}</span>
              {absent ? <CheckSquare size={18} color="#E5484D" /> : <Square size={18} color={colors.bgSoft} />}
              <span style={{ fontSize: 12, width: 56, textAlign: "right", color: absent ? "#E5484D" : colors.inkSoft }}>
                {absent ? "Absent" : "Present"}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>Present: {present} of {students.length}</span>
        <button
          onClick={() => onSubmit(absentRolls)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: colors.primaryDark, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          <Send size={15} /> Submit
        </button>
      </div>
    </div>
  );
}

function AttendanceDoneScreen({ summary, onBack }) {
  return (
    <div>
      <ScreenHeader title="Attendance submitted" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, textAlign: "center", boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: colors.primaryDark }}>{summary.percent}%</div>
        <div style={{ fontSize: 13, color: colors.inkSoft, marginBottom: 14 }}>{summary.present} present · {summary.absent} absent · {summary.total} total</div>
        <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>
          Sent to the principal's today attendance data ({teacherInfo.std}). Absent students' parents have been notified.
        </div>
      </div>
    </div>
  );
}

function LateComersScreen({ onBack, onMark, result }) {
  const [phone, setPhone] = useState("");
  return (
    <div>
      <ScreenHeader title="Late comers" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <FormField label="Student's phone number" value={phone} onChange={setPhone} placeholder="98765 00001" />
        <button
          onClick={() => onMark(phone)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: colors.primaryDark, color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          <Clock size={15} /> Mark late & notify parent
        </button>
        {result && (
          <div style={{ marginTop: 14, fontSize: 13, color: result.found ? "#16A34A" : "#E5484D", fontWeight: 600 }}>
            {result.found ? `${result.name} (Roll #${result.roll}) marked late. Parent notified.` : "No student found with this phone number."}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ PARENT DASHBOARD ============

const statusStyles = {
  present: { label: "Present", color: "#16A34A", bg: "#EAFBF1", Icon: CheckSquare },
  late: { label: "Late", color: "#C98A2B", bg: "#FDF4E3", Icon: Clock },
  absent: { label: "Absent", color: "#E5484D", bg: "#FDEEEC", Icon: X },
};

function ParentApp({ loginId, onLogout }) {
  const [screen, setScreen] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans }}>
      {screen !== "profile" && <ParentTopBar onProfile={() => setScreen("profile")} />}

      <div style={{ padding: 16 }}>
        {screen === "home" && (
          <div>
            <MenuRow number={1} icon={Bell} label="Announcement" onClick={() => setScreen("today")} />
            <MenuRow number={2} icon={CalendarDays} label="Attendance report" onClick={() => setScreen("report")} />
            <MenuRow number={3} icon={Megaphone} label="Announcements" onClick={() => setScreen("announcements")} />
          </div>
        )}

        {screen === "profile" && (
          <ParentProfilePanel loginId={loginId} onClose={() => setScreen("home")} onLogout={onLogout} />
        )}

        {screen === "today" && <ParentTodayStatusScreen onBack={() => setScreen("home")} />}

        {screen === "report" && <ParentAttendanceReportScreen onBack={() => setScreen("home")} />}

        {screen === "announcements" && <ParentAnnouncementsScreen onBack={() => setScreen("home")} />}
      </div>
    </div>
  );
}

function ParentTopBar({ onProfile }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <GraduationCap size={20} color={colors.primary} />
        <span style={{ fontSize: 15, fontWeight: 800, color: colors.ink }}>MyEdu</span>
      </div>
      <button
        onClick={onProfile}
        style={{ width: 38, height: 38, borderRadius: "50%", background: colors.card, border: `1px solid ${colors.bgSoft}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <User size={18} color={colors.primary} />
      </button>
    </div>
  );
}

function ParentProfilePanel({ loginId, onClose, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: sans, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>Profile</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color={colors.ink} />
        </button>
      </div>
      <div style={{ background: colors.card, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <InfoRow label="User ID" value={loginId} />
        <InfoRow label="Child's name" value={parentInfo.childName} />
        <InfoRow label="Student ID" value={parentInfo.childStudentId} />
        <InfoRow label="Class" value={parentInfo.childStandard} />
        <InfoRow label="School" value={parentInfo.childSchool} />
      </div>
      <button
        onClick={onLogout}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#fff", color: "#C0392B", border: `1px solid ${colors.bgSoft}`,
          padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}

function ParentTodayStatusScreen({ onBack }) {
  const s = statusStyles[todayChildStatus];
  return (
    <div>
      <ScreenHeader title="Today's announcement" onBack={onBack} />
      <div style={{ background: colors.card, borderRadius: 14, padding: 24, textAlign: "center", boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <div style={{ fontSize: 13, color: colors.inkSoft, marginBottom: 4 }}>{parentInfo.childName} · {parentInfo.childStandard}</div>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: s.bg, color: s.color,
            padding: "10px 20px", borderRadius: 999, fontSize: 18, fontWeight: 800, margin: "10px 0",
          }}
        >
          <s.Icon size={20} /> {s.label}
        </div>
        <div style={{ fontSize: 12, color: colors.inkSoft }}>Updated by the class teacher · 3 September 2026</div>
      </div>
    </div>
  );
}

function ParentAttendanceReportScreen({ onBack }) {
  const present = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18];
  const absent = [5, 12];
  const totalWorkingDays = 16;
  const percentage = Math.round((present.length / totalWorkingDays) * 100);

  return (
    <div>
      <ScreenHeader title="Attendance report" onBack={onBack} />
      <div style={{ fontSize: 13, color: colors.inkSoft, marginBottom: 12 }}>{parentInfo.childName} · {parentInfo.childStandard}</div>
      <div style={{ background: colors.card, borderRadius: 14, padding: 16, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <b style={{ color: colors.ink }}>September 2026</b>
        <div style={{ marginTop: 18 }}>
          <StudentAttendanceCalendar present={present} absent={absent} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11, color: colors.inkSoft }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: colors.primary, marginRight: 4 }} />Present</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: colors.red, marginRight: 4 }} />Absent</span>
        </div>
      </div>

      <div style={{ background: colors.card, borderRadius: 14, padding: 16, textAlign: "center", marginTop: 14, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
        <div style={{ fontSize: 12, color: colors.inkSoft, marginBottom: 4 }}>Monthly attendance</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: colors.primaryDark }}>{percentage}%</div>
      </div>
    </div>
  );
}

function ParentAnnouncementsScreen({ onBack }) {
  return (
    <div>
      <ScreenHeader title="Announcements" onBack={onBack} />
      {parentAnnouncementsDemo.map((n, i) => (
        <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: "0 4px 14px rgba(45,125,210,0.10)" }}>
          <div style={{ fontSize: 13, color: colors.ink }}>{n.text}</div>
          <div style={{ fontSize: 11, color: colors.inkSoft, marginTop: 4 }}>{n.from} · {n.date}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 3D SCIENCE LAB (merged in — reuses colors/sans from above)
// ============================================================

const subjectsMeta = [
  { key: "physics", label: "Physics", icon: Atom },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical },
  { key: "biology", label: "Biology", icon: Dna },
];

const experiments = [
  { id: "ohms-law", subject: "physics", std: 10, title: "Ohm's Law Circuit", desc: "Change voltage and resistance, watch the bulb and ammeter respond in real time.", built: true },
  { id: "mirror", subject: "physics", std: 10, title: "Concave Mirror Reflection", desc: "Trace the image formed at different object distances.", built: true },

  // Physics — Class 11
  { id: "p11-1", subject: "physics", std: 11, title: "Vernier Calipers", desc: "Diameter, dimensions and volume/density of a solid.", built: true },
  { id: "p11-2", subject: "physics", std: 11, title: "Screw Gauge", desc: "Diameter of a wire, thickness of a sheet.", built: true },
  { id: "p11-3", subject: "physics", std: 11, title: "Spherometer", desc: "Radius of curvature of a spherical surface.", built: true },
  { id: "p11-4", subject: "physics", std: 11, title: "Beam Balance", desc: "Mass of different objects.", built: true },
  { id: "p11-5", subject: "physics", std: 11, title: "Parallelogram Law of Vectors", desc: "Find the weight of a given body.", built: true },
  { id: "p11-6", subject: "physics", std: 11, title: "Simple Pendulum", desc: "L vs T² graph and time period.", built: true },
  { id: "p11-7", subject: "physics", std: 11, title: "Friction", desc: "Limiting friction and coefficient of friction.", built: true },
  { id: "p11-8", subject: "physics", std: 11, title: "Inclined Plane", desc: "Force vs angle of inclination.", built: true },
  { id: "p11-9", subject: "physics", std: 11, title: "Young's Modulus", desc: "Modulus of a given wire's material.", built: true },
  { id: "p11-10", subject: "physics", std: 11, title: "Helical Spring", desc: "Force constant / effective mass.", built: true },
  { id: "p11-11", subject: "physics", std: 11, title: "Boyle's Law", desc: "Pressure-volume relationship of a gas.", built: true },
  { id: "p11-12", subject: "physics", std: 11, title: "Surface Tension", desc: "Capillary rise method.", built: true },
  { id: "p11-13", subject: "physics", std: 11, title: "Viscosity", desc: "Coefficient of viscosity from terminal velocity.", built: true },
  { id: "p11-14", subject: "physics", std: 11, title: "Cooling Curve", desc: "Temperature of a hot body vs time.", built: true },
  { id: "p11-15", subject: "physics", std: 11, title: "Sonometer", desc: "Frequency, length and tension relationship.", built: true },
  { id: "p11-16", subject: "physics", std: 11, title: "Resonance Tube", desc: "Velocity of sound in air.", built: true },
  { id: "p11-17", subject: "physics", std: 11, title: "Specific Heat Capacity", desc: "Method of mixtures.", built: true },

  // Physics — Class 12
  { id: "p12-1", subject: "physics", std: 12, title: "Resistance per Unit Length", desc: "Of a wire, from its V-I graph.", built: true },
  { id: "p12-2", subject: "physics", std: 12, title: "Resistance & Resistivity", desc: "Of a wire, using a metre bridge.", built: true },
  { id: "p12-3", subject: "physics", std: 12, title: "Combination of Resistances", desc: "Series/parallel laws using a metre bridge.", built: true },
  { id: "p12-4", subject: "physics", std: 12, title: "EMF of Two Cells", desc: "Compare using a potentiometer.", built: true },
  { id: "p12-5", subject: "physics", std: 12, title: "Internal Resistance of a Cell", desc: "Using a potentiometer.", built: true },
  { id: "p12-6", subject: "physics", std: 12, title: "Galvanometer Resistance & Figure of Merit", desc: "Half-deflection method.", built: true },
  { id: "p12-7", subject: "physics", std: 12, title: "Galvanometer Conversion", desc: "Into an ammeter or voltmeter.", built: true },
  { id: "p12-8", subject: "physics", std: 12, title: "AC Mains Frequency", desc: "Using a sonometer and electromagnet.", built: true },
  { id: "p12-9", subject: "physics", std: 12, title: "Minimum Deviation of a Prism", desc: "From the i-δ graph.", built: true },
  { id: "p12-10", subject: "physics", std: 12, title: "Refractive Index of a Glass Slab", desc: "Using a travelling microscope.", built: true },
  { id: "p12-11", subject: "physics", std: 12, title: "Refractive Index of a Liquid", desc: "Lens / plane mirror method.", built: true },
  { id: "p12-12", subject: "physics", std: 12, title: "Focal Length of a Convex Lens", desc: "From the u-v graph.", built: true },
  { id: "p12-13", subject: "physics", std: 12, title: "Focal Length of a Concave Mirror", desc: "Convex lens method.", built: true },
  { id: "p12-14", subject: "physics", std: 12, title: "Focal Length of a Convex Mirror", desc: "Convex lens method.", built: true },
  { id: "p12-15", subject: "physics", std: 12, title: "Concave Mirror", desc: "Focal length from different u values.", built: true },
  { id: "p12-16", subject: "physics", std: 12, title: "p-n Junction Diode", desc: "I-V characteristics.", built: true },

  // Chemistry — Class 11
  { id: "c11-1", subject: "chemistry", std: 11, title: "Standard Oxalic Acid Solution", desc: "Preparation of a standard solution.", built: true },
  { id: "c11-2", subject: "chemistry", std: 11, title: "Concentration of NaOH", desc: "Using standard Oxalic Acid.", built: true },
  { id: "c11-3", subject: "chemistry", std: 11, title: "Concentration of KOH", desc: "Using standard Oxalic Acid.", built: true },
  { id: "c11-4", subject: "chemistry", std: 11, title: "Concentration of HCl", desc: "Using standard Sodium Carbonate.", built: true },
  { id: "c11-5", subject: "chemistry", std: 11, title: "Concentration of H₂SO₄", desc: "By titration.", built: true },
  { id: "c11-6", subject: "chemistry", std: 11, title: "pH Determination", desc: "Of different everyday solutions.", built: true },
  { id: "c11-7", subject: "chemistry", std: 11, title: "Acidic & Basic Radicals", desc: "Identification in salts.", built: true },
  { id: "c11-8", subject: "chemistry", std: 11, title: "Carbonate & Bicarbonate Tests", desc: "Ion identification tests.", built: true },
  { id: "c11-9", subject: "chemistry", std: 11, title: "Chloride, Bromide, Iodide Tests", desc: "Ion identification tests.", built: true },
  { id: "c11-10", subject: "chemistry", std: 11, title: "Sulphate & Sulphite Tests", desc: "Ion identification tests.", built: true },
  { id: "c11-11", subject: "chemistry", std: 11, title: "Ammonium Ion Test", desc: "Identification test.", built: true },
  { id: "c11-12", subject: "chemistry", std: 11, title: "Copper, Iron, Aluminium Ions", desc: "Identification tests.", built: true },
  { id: "c11-13", subject: "chemistry", std: 11, title: "Copper Sulphate Crystals", desc: "Preparation of crystals.", built: true },
  { id: "c11-14", subject: "chemistry", std: 11, title: "Mohr's Salt Crystals", desc: "Preparation of Ferrous Ammonium Sulphate crystals.", built: true },
  { id: "c11-15", subject: "chemistry", std: 11, title: "Potassium Alum Crystals", desc: "Preparation of crystals.", built: true },
  { id: "c11-16", subject: "chemistry", std: 11, title: "Chemical Equilibrium", desc: "Effect of concentration.", built: true },
  { id: "c11-17", subject: "chemistry", std: 11, title: "Oxidation-Reduction Reactions", desc: "Study of redox reactions.", built: true },

  // Chemistry — Class 12
  { id: "c12-1", subject: "chemistry", std: 12, title: "Standard Oxalic Acid Solution", desc: "Preparation of a standard solution.", built: true },
  { id: "c12-2", subject: "chemistry", std: 12, title: "Concentration of KMnO₄", desc: "Using standard Oxalic Acid.", built: true },
  { id: "c12-3", subject: "chemistry", std: 12, title: "Standard FAS Solution", desc: "Preparation of Ferrous Ammonium Sulphate solution.", built: true },
  { id: "c12-4", subject: "chemistry", std: 12, title: "Concentration of KMnO₄ (via FAS)", desc: "Using standard FAS.", built: true },
  { id: "c12-5", subject: "chemistry", std: 12, title: "Enthalpy of Dissolution", desc: "Of Copper Sulphate / Potassium Nitrate.", built: true },
  { id: "c12-6", subject: "chemistry", std: 12, title: "Enthalpy of Neutralisation", desc: "Of HCl and NaOH.", built: true },
  { id: "c12-7", subject: "chemistry", std: 12, title: "Enthalpy of Interaction", desc: "Acetone and Chloroform.", built: true },
  { id: "c12-8", subject: "chemistry", std: 12, title: "Electrochemical Cell", desc: "Effect of concentration on cell potential.", built: true },
  { id: "c12-9", subject: "chemistry", std: 12, title: "Chemical Kinetics — Thiosulphate + HCl", desc: "Rate of reaction via turbidity.", built: true },
  { id: "c12-10", subject: "chemistry", std: 12, title: "Chemical Kinetics — Iodide + H₂O₂", desc: "Rate of reaction study.", built: true },
  { id: "c12-11", subject: "chemistry", std: 12, title: "Adsorption", desc: "Study of adsorption.", built: true },
  { id: "c12-12", subject: "chemistry", std: 12, title: "Preparation of Colloids", desc: "Colloid preparation methods.", built: true },
  { id: "c12-13", subject: "chemistry", std: 12, title: "Emulsifying Agents", desc: "Effect on emulsions.", built: true },
  { id: "c12-14", subject: "chemistry", std: 12, title: "Rate of Reaction — Thiosulphate + HCl", desc: "Under different conditions.", built: true },
  { id: "c12-15", subject: "chemistry", std: 12, title: "Rate of Reaction — Iodide + H₂O₂", desc: "At room temperature.", built: true },
  { id: "c12-16", subject: "chemistry", std: 12, title: "Qualitative Salt Analysis", desc: "Identification of ions in a given salt.", built: true },
  { id: "digestive", subject: "biology", std: 10, title: "Human Digestive System", desc: "Walk through each organ in a rotatable 3D body model.", built: true },
  { id: "plant-cell", subject: "biology", std: 11, title: "Plant Cell Structure", desc: "Explore organelles inside a labelled 3D plant cell.", built: true },
  { id: "dna", subject: "biology", std: 12, title: "DNA Double Helix", desc: "Rotate the helix and tap a rung to see its base pair.", built: true },

  // Biology — Class 10
  { id
