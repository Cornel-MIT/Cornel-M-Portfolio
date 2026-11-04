export const projects = [
  {
    id: 'aktive60', name: 'Aktive60', icon: '🏋️', cover: '🏃',
    status: 'Completed',
    summary: 'A cross-platform gym application connecting trainers and trainees.',
    details: 'Developed a mobile application for trainer-trainee interaction with secure authentication, real-time chat, session booking, and Paystack in-app payments.',
    stack: ['React Native', 'Firebase', 'Expo', 'Paystack'],
    images: [
      { src: '/images/aktive60/Screenshot_2025-03-31-14-15-13-780_com.akiv60.akiv60native.jpg', alt: 'Aktive60 home screen with fitness snapshot and bookings', caption: 'Home' },
      { src: '/images/aktive60/Screenshot_2025-03-17-21-48-14-063_host.exp.exponent.jpg', alt: 'Aktive60 training package selection screen', caption: 'Training packages' },
      { src: '/images/aktive60/Screenshot_2025-03-31-14-15-00-677_com.akiv60.akiv60native.jpg', alt: 'Aktive60 bookings screen showing upcoming sessions', caption: 'Bookings' },
    ],
  },
  {
    id: 'momakit-mobile', name: 'WeLinkUp', icon: '📱', cover: '📲',
    status: 'Completed',
    summary: 'A client mobile application developed and delivered at MomakIT.',
    details: 'Led end-to-end mobile application development, including frontend implementation, backend API integration, system design contributions, testing, iteration, and deployment.',
    stack: ['React Native', 'Node.js', 'REST APIs'],
    images: [
      { src: '/images/welinkup/HomeScreen.jpg', alt: 'WeLinkUp home screen for browsing service listings', caption: 'Home' },
      { src: '/images/welinkup/DashboardScreen.jpg', alt: 'WeLinkUp freelancer dashboard with earnings and recent orders', caption: 'Dashboard' },
      { src: '/images/welinkup/PaymentScreen.jpg', alt: 'WeLinkUp payment screen with saved payment methods', caption: 'Payment methods' },
      { src: '/images/welinkup/ProfileScreen.jpg', alt: 'WeLinkUp client profile with account and booking options', caption: 'Client profile' },
      { src: '/images/welinkup/Profile02Screen.jpg', alt: 'WeLinkUp service detail page with provider information and booking action', caption: 'Service details' },
    ],
    videoUrl: 'https://youtu.be/zSOY8GgvzK8',
  },
  {
    id: 'career-buddy', name: 'Career Buddy', icon: '🧭', cover: '🎓',
    status: 'In progress',
    summary: 'An AI-powered career guidance tool helping high school students explore career paths that fit their interests through an A-to-A approach.',
    details: 'In progress: building an AI-powered experience to help high school students identify and explore career paths that suit their interests, using an A-to-A approach.',
    stack: [],
    images: [
      { src: '/images/career-buddy/HomePage.png', alt: 'Career Buddy home page introducing its career guidance assessment', caption: 'Home' },
      { src: '/images/career-buddy/QuestionPage.png', alt: 'Career Buddy career-interest assessment question', caption: 'Assessment' },
      { src: '/images/career-buddy/RegistrationPage.png', alt: 'Career Buddy account registration form', caption: 'Registration' },
    ],
  },
  {
    id: 'n2te', name: 'N2te', icon: '🤝', cover: '💬',
    status: 'In progress',
    summary: 'An online mentoring platform where mentors help students navigate career choices.',
    details: 'In progress: creating a mentor-focused platform that connects students with online mentors for guidance through different career choices.',
    stack: [],
    images: [
      { src: '/images/n2te/Screenshot 2026-11-04 142309.png', alt: 'N2te student and tutor sign-in screen', caption: 'Sign in' },
      { src: '/images/n2te/Screenshot 2026-11-04 142414.png', alt: 'N2te tutor dashboard for managing courses and students', caption: 'Tutor dashboard' },
      { src: '/images/n2te/Screenshot 2026-11-04 142434.png', alt: 'N2te student progress view with performance and attendance details', caption: 'Student progress' },
    ],
  },
]
