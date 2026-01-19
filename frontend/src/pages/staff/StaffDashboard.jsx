import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Tabs, Tab, Typography,
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, Chip,
  Avatar, Grid, Paper, Fab,
  useTheme, alpha, IconButton,
  LinearProgress, Badge, Tooltip,
  Zoom, Fade, Slide,
  AppBar, Toolbar, Drawer,
  ListItemIcon, ListItemButton,
  Divider, useMediaQuery,
  Stack, AlertTitle,
  Accordion, AccordionSummary, AccordionDetails,
  Switch, FormControlLabel,
  Skeleton, Backdrop,
  SpeedDial, SpeedDialAction,
  Dialog, DialogTitle, DialogContent,
  DialogActions, DialogContentText,
  Chip as MuiChip, ButtonGroup,
  ToggleButton, ToggleButtonGroup,
  Rating, AvatarGroup,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Pagination, InputAdornment,
  CardActionArea, CardActions,
  Breadcrumbs, Link as MuiLink,
  Stepper, Step, StepLabel,
  StepContent, StepButton,
  CircularProgress as MuiCircularProgress,
  Select, MenuItem
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  BarChart as AnalyticsIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  ZoomIn as ZoomInIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Send as SendIcon,
  NotificationsActive as NotificationsActiveIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  MilitaryTech as MilitaryTechIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  Whatshot as WhatshotIcon,
  AutoAwesome as AutoAwesomeIcon,
  Star as SparklesIcon,
  NightsStay as NightsStayIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  GppGood as GppGoodIcon,
  Verified as VerifiedIcon,
  NewReleases as NewReleasesIcon,
  Update as UpdateIcon,
  Sync as SyncIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  DataUsage as DataUsageIcon,
  Leaderboard as LeaderboardIcon,
  Equalizer as EqualizerIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  DonutLarge as DonutLargeIcon,
  ScatterPlot as ScatterPlotIcon,
  BubbleChart as BubbleChartIcon,
  TableChart as TableChartIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewStream as ViewStreamIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewColumn as ViewColumnIcon,
  ViewSidebar as ViewSidebarIcon,
  Favorite as FavoriteIcon,
  FlashOn as FlashOnIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../../contexts/AuthContext';
import BookingManagement from '../../components/booking/BookingManagement';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import ScheduleView from '../../components/scheduling/ScheduleView';
import NotificationSystem from '../../components/notifications/NotificationSystem';
import { 
  Timeline, 
  TimelineItem,
  TimelineSeparator, 
  TimelineConnector,
  TimelineContent, 
  TimelineDot 
} from '@mui/lab';

const StaffDashboard = () => {
  console.log('Staff Dashboard component loaded - v2');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedAchievement, setExpandedAchievement] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [quickStats, setQuickStats] = useState(true);
  const [miniMode, setMiniMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showShadows, setShowShadows] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [themeAccent, setThemeAccent] = useState('blue');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [gestureControls, setGestureControls] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [predictiveSearch, setPredictiveSearch] = useState(true);
  const [contextMenu, setContextMenu] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);
  const [batchActions, setBatchActions] = useState(true);
  const [realTimeCollaboration, setRealTimeCollaboration] = useState(false);
  const [aiAssist, setAiAssist] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [customWidgets, setCustomWidgets] = useState(true);
  const [dataVisualization, setDataVisualization] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [securityMode, setSecurityMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [experimentalUI, setExperimentalUI] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    skills: [],
    bio: '',
    experience: '',
    certifications: [],
    languages: [],
    availability: 'full-time',
    hourlyRate: 0,
    portfolio: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    upcomingEvents: 0,
    earnings: 0,
    rating: 4.8,
    responseTime: 2.5,
    completionRate: 95,
    clientSatisfaction: 98,
    monthlyGrowth: 12,
    activeProjects: 3,
    totalClients: 28,
    repeatClients: 15
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'booking', message: 'New booking received from John Smith', time: '2 hours ago', icon: <AssignmentIcon />, color: 'primary' },
    { id: 2, type: 'payment', message: 'Payment received for Wedding Ceremony', time: '5 hours ago', icon: <PaymentIcon />, color: 'success' },
    { id: 3, type: 'review', message: 'New 5-star review from Sarah Johnson', time: '1 day ago', icon: <StarIcon />, color: 'warning' },
    { id: 4, type: 'message', message: 'New message from support team', time: '2 days ago', icon: <ChatIcon />, color: 'info' }
  ]);
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Top Performer', description: 'Completed 50+ events', icon: <EmojiEventsIcon />, earned: true, date: '2024-01-15' },
    { id: 2, title: '5-Star Rating', description: 'Maintained 5.0 rating for 3 months', icon: <StarIcon />, earned: true, date: '2024-01-10' },
    { id: 3, title: 'Quick Responder', description: 'Response time under 1 hour', icon: <SpeedIcon />, earned: false, progress: 75 },
    { id: 4, title: 'Client Favorite', description: '20+ repeat clients', icon: <FavoriteIcon />, earned: false, progress: 60 }
  ]);
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardRef = useRef();

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      
      @keyframes sparkle {
        0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
        25% { opacity: 0.8; transform: scale(1.1) rotate(5deg); }
        50% { opacity: 1; transform: scale(1) rotate(0deg); }
        75% { opacity: 0.8; transform: scale(1.1) rotate(-5deg); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5); }
        50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.8); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-8px); }
        70% { transform: translateY(-4px); }
      }
      
      @keyframes wave {
        0% { transform: rotate(0deg); }
        10% { transform: rotate(1deg); }
        20% { transform: rotate(-1deg); }
        30% { transform: rotate(0deg); }
        40% { transform: rotate(1deg); }
        50% { transform: rotate(0deg); }
        60% { transform: rotate(-1deg); }
        70% { transform: rotate(0deg); }
        80% { transform: rotate(1deg); }
        90% { transform: rotate(0deg); }
        100% { transform: rotate(0deg); }
      }
      
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
      
      .live-indicator {
        animation: pulse 1.5s infinite, glow 2s infinite;
      }
      
      .sparkle-effect {
        animation: sparkle 2s infinite;
      }
      
      .hover-lift {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
      
      .gradient-text {
        background: linear-gradient(45deg, #2196F3, #21CBF3, #1976D2, #BB6BD);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      
      .rotating-icon {
        animation: rotate 4s linear infinite;
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .bounce-in {
        animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { opacity: 1; transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      .slide-in {
        animation: slideIn 0.5s ease-out;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .wave-effect {
        position: relative;
        overflow: hidden;
      }
      
      .wave-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: wave 3s linear infinite;
      }
      
      @keyframes wave {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(-25%) translateY(-20%); }
        100% { transform: translateX(0%) translateY(0); }
      }
      
      .ripple-button {
        position: relative;
        overflow: hidden;
      }
      
      .ripple-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      
      .ripple-button:hover::before {
        width: 300px;
        height: 300px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Staff',
        department: user.department || 'Event Management',
        skills: user.skills || ['Photography', 'Event Setup']
      });

      // Enhanced mock user bookings data with more details
      const mockBookings = [
        {
          id: 1,
          customerName: 'John Smith',
          eventName: 'Wedding Ceremony',
          date: '2024-01-15',
          time: '14:00',
          location: 'Grand Ballroom',
          status: 'confirmed',
          services: ['Photography', 'Decoration'],
          paymentStatus: 'paid',
          amount: 5000,
          customerRating: 5,
          notes: 'Special lighting setup required'
        },
        {
          id: 2,
          customerName: 'Sarah Johnson',
          eventName: 'Corporate Event',
          date: '2024-01-18',
          time: '10:00',
          location: 'Conference Hall A',
          status: 'pending',
          services: ['Videography', 'Catering'],
          paymentStatus: 'pending',
          amount: 3500,
          customerRating: 0,
          notes: 'Client prefers natural lighting'
        },
        {
          id: 3,
          customerName: 'Mike Wilson',
          eventName: 'Birthday Party',
          date: '2024-01-20',
          time: '18:00',
          location: 'Garden Area',
          status: 'completed',
          services: ['Photography', 'Entertainment'],
          paymentStatus: 'paid',
          amount: 2500,
          customerRating: 4.5,
          notes: 'Outdoor event, weather backup needed'
        },
        {
          id: 4,
          customerName: 'Emily Davis',
          eventName: 'Product Launch',
          date: '2024-01-25',
          time: '15:00',
          location: 'Rooftop Venue',
          status: 'confirmed',
          services: ['Photography', 'Live Streaming'],
          paymentStatus: 'paid',
          amount: 4500,
          customerRating: 0,
          notes: 'Live streaming to social media required'
        }
      ];

      setUserBookings(mockBookings);
      
      // Calculate statistics
      const completed = mockBookings.filter(b => b.status === 'completed').length;
      const pending = mockBookings.filter(b => b.status === 'pending').length;
      const confirmed = mockBookings.filter(b => b.status === 'confirmed').length;
      const upcoming = mockBookings.filter(b => new Date(b.date) > new Date()).length;
      const totalEarnings = mockBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.amount, 0);
      const avgRating = mockBookings
        .filter(b => b.customerRating > 0)
        .reduce((sum, b) => sum + b.customerRating, 0) / 
        mockBookings.filter(b => b.customerRating > 0).length || 0;

      setStats({
        totalBookings: mockBookings.length,
        completedBookings: completed,
        pendingBookings: pending,
        upcomingEvents: upcoming,
        earnings: totalEarnings,
        rating: avgRating || 4.8,
        responseTime: 2.5,
        completionRate: Math.round((completed / mockBookings.length) * 100),
        clientSatisfaction: Math.round((avgRating || 4.8) * 20),
        monthlyGrowth: 12,
        activeProjects: confirmed + pending,
        totalClients: mockBookings.length,
        repeatClients: Math.round(mockBookings.length * 0.4)
      });

      setLoading(false);
    }
  }, [user]); // Add user as dependency to re-run when user data changes

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
    toast.success('Dashboard refreshed successfully!');
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'availability':
        setActiveTab(1);
        break;
      case 'bookings':
        setActiveTab(3);
        break;
      case 'notifications':
        setActiveTab(4);
        setNotifications(0);
        break;
      case 'profile':
        setActiveTab(0);
        break;
      case 'schedule':
        setActiveTab(2);
        break;
      case 'analytics':
        // Navigate to analytics or show analytics modal
        toast.info('Analytics feature coming soon!');
        break;
      case 'settings':
        setDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(`Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}`);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    toast.success(`Sound notifications ${!soundEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleLiveModeToggle = () => {
    setLiveMode(!liveMode);
    toast.success(`Live mode ${!liveMode ? 'enabled' : 'disabled'}`);
  };

  const handlePulseAnimationToggle = () => {
    setPulseAnimation(!pulseAnimation);
    toast.success(`Pulse animations ${!pulseAnimation ? 'enabled' : 'disabled'}`);
  };

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleAchievementExpand = (achievementId) => {
    setExpandedAchievement(expandedAchievement === achievementId ? null : achievementId);
  };

  const handleRealTimeUpdatesToggle = () => {
    setRealTimeUpdates(!realTimeUpdates);
    toast.success(`Real-time updates ${!realTimeUpdates ? 'enabled' : 'disabled'}`);
  };

  const handleNotificationSoundToggle = () => {
    setNotificationSound(!notificationSound);
    toast.success(`Notification sounds ${!notificationSound ? 'enabled' : 'disabled'}`);
  };

  const handleAutoSaveToggle = () => {
    setAutoSave(!autoSave);
    toast.success(`Auto-save ${!autoSave ? 'enabled' : 'disabled'}`);
  };

  const handleQuickStatsToggle = () => {
    setQuickStats(!quickStats);
    toast.success(`Quick stats ${!quickStats ? 'enabled' : 'disabled'}`);
  };

  const handleMiniModeToggle = () => {
    setMiniMode(!miniMode);
    toast.success(`Mini mode ${!miniMode ? 'enabled' : 'disabled'}`);
  };

  const handleCompactViewToggle = () => {
    setCompactView(!compactView);
    toast.success(`Compact view ${!compactView ? 'enabled' : 'disabled'}`);
  };

  const handleShowShadowsToggle = () => {
    setShowShadows(!showShadows);
    toast.success(`Shadows ${!showShadows ? 'enabled' : 'disabled'}`);
  };

  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    toast.success(`Animation speed set to ${speed}`);
  };

  const handleThemeAccentChange = (accent) => {
    setThemeAccent(accent);
    toast.success(`Theme accent changed to ${accent}`);
  };

  const handleSidebarCollapseToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFullscreenToggle = () => {
    setFullscreenMode(!fullscreenMode);
    if (!fullscreenMode) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleKeyboardShortcutsToggle = () => {
    setKeyboardShortcuts(!keyboardShortcuts);
    toast.success(`Keyboard shortcuts ${!keyboardShortcuts ? 'enabled' : 'disabled'}`);
  };

  const handleVoiceCommandsToggle = () => {
    setVoiceCommands(!voiceCommands);
    toast.success(`Voice commands ${!voiceCommands ? 'enabled' : 'disabled'}`);
  };

  const handleGestureControlsToggle = () => {
    setGestureControls(!gestureControls);
    toast.success(`Gesture controls ${!gestureControls ? 'enabled' : 'disabled'}`);
  };

  const handleAutoSyncToggle = () => {
    setAutoSync(!autoSync);
    toast.success(`Auto-sync ${!autoSync ? 'enabled' : 'disabled'}`);
  };

  const handleSmartSuggestionsToggle = () => {
    setSmartSuggestions(!smartSuggestions);
    toast.success(`Smart suggestions ${!smartSuggestions ? 'enabled' : 'disabled'}`);
  };

  const handlePredictiveSearchToggle = () => {
    setPredictiveSearch(!predictiveSearch);
    toast.success(`Predictive search ${!predictiveSearch ? 'enabled' : 'disabled'}`);
  };

  const handleContextMenuToggle = () => {
    setContextMenu(!contextMenu);
    toast.success(`Context menu ${!contextMenu ? 'enabled' : 'disabled'}`);
  };

  const handleDragDropToggle = () => {
    setDragDrop(!dragDrop);
    toast.success(`Drag & drop ${!dragDrop ? 'enabled' : 'disabled'}`);
  };

  const handleBatchActionsToggle = () => {
    setBatchActions(!batchActions);
    toast.success(`Batch actions ${!batchActions ? 'enabled' : 'disabled'}`);
  };

  const handleRealTimeCollaborationToggle = () => {
    setRealTimeCollaboration(!realTimeCollaboration);
    toast.success(`Real-time collaboration ${!realTimeCollaboration ? 'enabled' : 'disabled'}`);
  };

  const handleAiAssistToggle = () => {
    setAiAssist(!aiAssist);
    toast.success(`AI assistant ${!aiAssist ? 'enabled' : 'disabled'}`);
  };

  const handleAdvancedFiltersToggle = () => {
    setAdvancedFilters(!advancedFilters);
    toast.success(`Advanced filters ${!advancedFilters ? 'enabled' : 'disabled'}`);
  };

  const handleCustomWidgetsToggle = () => {
    setCustomWidgets(!customWidgets);
    toast.success(`Custom widgets ${!customWidgets ? 'enabled' : 'disabled'}`);
  };

  const handleDataVisualizationToggle = () => {
    setDataVisualization(!dataVisualization);
    toast.success(`Data visualization ${!dataVisualization ? 'enabled' : 'disabled'}`);
  };

  const handlePerformanceMetricsToggle = () => {
    setPerformanceMetrics(!performanceMetrics);
    toast.success(`Performance metrics ${!performanceMetrics ? 'enabled' : 'disabled'}`);
  };

  const handleSmartNotificationsToggle = () => {
    setSmartNotifications(!smartNotifications);
    toast.success(`Smart notifications ${!smartNotifications ? 'enabled' : 'disabled'}`);
  };

  const handleAutoBackupToggle = () => {
    setAutoBackup(!autoBackup);
    toast.success(`Auto-backup ${!autoBackup ? 'enabled' : 'disabled'}`);
  };

  const handleSecurityModeToggle = () => {
    setSecurityMode(!securityMode);
    toast.success(`Security mode ${!securityMode ? 'enabled' : 'disabled'}`);
  };

  const handleOfflineModeToggle = () => {
    setOfflineMode(!offlineMode);
    toast.success(`Offline mode ${!offlineMode ? 'enabled' : 'disabled'}`);
  };

  const handleBetaFeaturesToggle = () => {
    setBetaFeatures(!betaFeatures);
    toast.success(`Beta features ${!betaFeatures ? 'enabled' : 'disabled'}`);
  };

  const handleExperimentalUIToggle = () => {
    setExperimentalUI(!experimentalUI);
    toast.success(`Experimental UI ${!experimentalUI ? 'enabled' : 'disabled'}`);
  };

  const filteredBookings = userBookings.filter(booking => {
    const matchesSearch = booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch(sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'name':
        return a.customerName.localeCompare(b.customerName);
      case 'amount':
        return b.amount - a.amount;
      case 'rating':
        return b.customerRating - a.customerRating;
      default:
        return 0;
    }
  });

  const paginatedBookings = sortedBookings.slice((page - 1) * 6, page * 6);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('🔧 Staff Input change:', { name, value, isEditing });
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const handleDownloadPDF = async () => {
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('staff-dashboard.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'success' : 'warning';
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend, progress, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: pulseAnimation ? 1.05 : 1.02,
        rotate: pulseAnimation ? [0, 1, 0] : 0,
        transition: { duration: 2, repeat: pulseAnimation ? Infinity : 0 }
      }}
      onHoverStart={() => handleCardHover(`stat-${index}`)}
      onHoverEnd={handleCardLeave}
    >
      <Card
        sx={{
          height: '100%',
          background: liveMode 
            ? `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)}, ${alpha(theme.palette[color].dark, 0.1)})`
            : `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].dark, 0.05)})`,
          border: `2px solid ${alpha(theme.palette[color].main, 0.3)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: showShadows ? theme.shadows[8] : 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: showShadows ? theme.shadows[12] : 'none',
            transform: 'translateY(-4px)',
            borderColor: alpha(theme.palette[color].main, 0.6),
            background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.3)}, ${alpha(theme.palette[color].dark, 0.15)})`
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
            animation: liveMode ? 'pulse 2s infinite' : 'none'
          },
          '&::after': {
            content: liveMode ? '"LIVE"' : '""',
            position: 'absolute',
            top: 8,
            right: 8,
            background: theme.palette.error.main,
            color: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: '0.6rem',
            fontWeight: 'bold',
            animation: 'pulse 1.5s infinite',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <motion.div
              animate={{ 
                rotate: liveMode ? 360 : 0,
                transition: { duration: 10, repeat: liveMode ? Infinity : 0 }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette[color].main,
                  width: 56,
                  height: 56,
                  boxShadow: showShadows ? theme.shadows[4] : 'none',
                  background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                  border: hoveredCard === `stat-${index}` ? '3px solid white' : 'none'
                }}
              >
                {icon}
              </Avatar>
            </motion.div>
            {trend !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Chip
                  icon={trend > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={`${Math.abs(trend)}%`}
                  color={trend > 0 ? 'success' : 'error'}
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'white',
                    boxShadow: theme.shadows[2]
                  }}
                />
              </motion.div>
            )}
          </Box>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette[color].dark, 
                mb: 0.5,
                background: liveMode ? `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})` : 'none',
                WebkitBackgroundClip: liveMode ? 'text' : 'unset',
                WebkitTextFillColor: liveMode ? 'transparent' : 'unset',
                backgroundClip: liveMode ? 'text' : 'unset',
                textFillColor: liveMode ? 'transparent' : 'unset'
              }}
            >
              {typeof value === 'number' && value > 1000 ? `$${(value / 1000).toFixed(1)}k` : value}
            </Typography>
          </motion.div>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            </motion.div>
          )}
          {progress !== undefined && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette[color].main, 0.2),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                      boxShadow: theme.shadows[2],
                      borderRadius: 3
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  {progress}% Complete
                </Typography>
              </Box>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const ActivityTimeline = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            📈 Recent Activity
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {liveMode && (
              <Chip 
                icon={<WhatshotIcon />}
                label="LIVE" 
                color="error" 
                size="small"
                sx={{ 
                  animation: 'pulse 1.5s infinite',
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[4]
                }}
              />
            )}
            {realTimeUpdates && (
              <Chip 
                icon={<SyncIcon />}
                label="REAL-TIME" 
                color="primary" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>
        </Box>
        <Timeline>
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <TimelineItem>
                <TimelineSeparator>
                  <motion.div
                    animate={{ 
                      rotate: liveMode ? 360 : 0,
                      transition: { duration: 8, repeat: liveMode ? Infinity : 0 }
                    }}
                  >
                    <TimelineDot 
                      color={activity.color}
                      sx={{
                        boxShadow: showShadows ? theme.shadows[4] : 'none',
                        border: liveMode ? `2px solid ${theme.palette[activity.color].main}` : 'none',
                        background: liveMode ? `linear-gradient(135deg, ${theme.palette[activity.color].main}, ${theme.palette[activity.color].dark})` : theme.palette[activity.color].main
                      }}
                    >
                      {activity.icon}
                    </TimelineDot>
                  </motion.div>
                  {index < recentActivity.length - 1 && (
                    <TimelineConnector 
                      sx={{
                        background: liveMode 
                          ? `linear-gradient(180deg, ${theme.palette[activity.color].main}, ${theme.palette[activity.color].dark})`
                          : theme.palette[activity.color].main
                      }}
                    />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {activity.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                    {liveMode && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: theme.palette.success.main,
                          mt: 1 
                        }} />
                      </motion.div>
                    )}
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            </motion.div>
          ))}
        </Timeline>
      </Box>
    </motion.div>
  );

  const AchievementCard = ({ achievement }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.05,
        rotate: [0, 1, 0],
        transition: { duration: 0.5, repeat: 1 }
      }}
      onClick={() => handleAchievementExpand(achievement.id)}
    >
      <Card
        sx={{
          p: 2,
          textAlign: 'center',
          background: achievement.earned 
            ? `linear-gradient(135deg, ${alpha(theme.palette.gold?.main || '#FFD700', 0.2)}, ${alpha(theme.palette.gold?.dark || '#FFA500', 0.1)})`
            : alpha(theme.palette.grey[100], 0.5),
          border: achievement.earned 
            ? `3px solid ${theme.palette.gold?.main || '#FFD700'}`
            : `2px solid ${alpha(theme.palette.grey[300], 0.5)}`,
          borderRadius: 2,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: showShadows ? (achievement.earned ? theme.shadows[8] : theme.shadows[4]) : 'none',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: showShadows ? theme.shadows[12] : 'none',
            borderColor: achievement.earned 
              ? theme.palette.gold?.main || '#FFD700'
              : alpha(theme.palette.primary.main, 0.6)
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: achievement.earned 
              ? `linear-gradient(90deg, ${theme.palette.gold?.main || '#FFD700'}, ${theme.palette.gold?.dark || '#FFA500'})`
              : 'transparent'
          },
          '&::after': {
            content: achievement.earned ? '"✨"' : '""',
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: '1.2rem',
            animation: achievement.earned ? 'sparkle 2s infinite' : 'none'
          }
        }}
      >
        <motion.div
          animate={{ 
            rotate: achievement.earned ? 360 : 0,
            transition: { duration: 20, repeat: achievement.earned ? Infinity : 0 }
          }}
        >
          <Avatar
            sx={{
              bgcolor: achievement.earned 
                ? theme.palette.gold?.main || '#FFD700'
                : theme.palette.grey[400],
              width: 48,
              height: 48,
              margin: '0 auto 8px',
              fontSize: '1.5rem',
              boxShadow: showShadows ? (achievement.earned ? theme.shadows[6] : theme.shadows[2]) : 'none',
              border: hoveredCard === achievement.id ? '3px solid white' : 'none',
              position: 'relative',
              '&::before': {
                content: expandedAchievement === achievement.id ? '"−"' : '"+"',
                position: 'absolute',
                top: -4,
                right: -4,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: '0.8rem',
                fontWeight: 'bold',
                boxShadow: theme.shadows[2],
                zIndex: 1
              }
            }}
          >
            {achievement.icon}
          </Avatar>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {achievement.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {achievement.description}
          </Typography>
          {!achievement.earned && achievement.progress !== undefined && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box>
                <LinearProgress 
                  variant="determinate" 
                  value={achievement.progress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: theme.shadows[2]
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  {achievement.progress}%
                </Typography>
              </Box>
            </motion.div>
          )}
          {achievement.earned && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label="Earned" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    boxShadow: theme.shadows[2]
                  }}
                />
                {achievement.date && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    📅 {achievement.date}
                  </Typography>
                )}
              </Box>
            </motion.div>
          )}
          {expandedAchievement === achievement.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 2, p: 1, backgroundColor: alpha(theme.palette.background.paper, 0.8), borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {achievement.earned 
                  ? `🎉 Congratulations! You earned this achievement on ${achievement.date}` 
                  : `🎯 Keep going! You're ${achievement.progress}% of the way there!`}
              </Typography>
            </Box>
            </motion.div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );

  const drawerItems = [
    { text: 'Profile', icon: <PersonIcon />, action: () => setActiveTab(0) },
    { text: 'Availability', icon: <CalendarIcon />, action: () => setActiveTab(1) },
    { text: 'Schedule', icon: <ScheduleIcon />, action: () => setActiveTab(2) },
    { text: 'Bookings', icon: <AssignmentIcon />, action: () => setActiveTab(3) },
    { text: 'Notifications', icon: <NotificationsIcon />, action: () => setActiveTab(4) },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div ref={dashboardRef}>
      {/* Enhanced Header with AppBar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: theme.shadows[4],
          mb: 2
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: theme.palette.primary.main,
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              <DashboardIcon />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Staff Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh Dashboard">
              <IconButton color="inherit" onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={() => handleQuickAction('notifications')}>
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Download PDF">
              <IconButton color="inherit" onClick={handleDownloadPDF}>
                <PdfIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Left Sidebar - Vertically Aligned */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 300,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: 300,
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            background: `linear-gradient(180deg, 
              ${alpha(theme.palette.primary.main, 0.08)} 0%, 
              ${alpha(theme.palette.primary.dark, 0.05)} 50%, 
              ${alpha(theme.palette.background.default, 0.95)} 100%)`,
            borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            overflowY: 'auto',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ 
          p: 3, 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          {/* Enhanced Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <Box sx={{ 
              textAlign: 'center',
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.primary.main, 0.15)}, 
                ${alpha(theme.palette.secondary.main, 0.1)},
                ${alpha(theme.palette.tertiary?.main || theme.palette.primary.main, 0.05)})`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main}, 
                  ${theme.palette.tertiary?.main || theme.palette.primary.main})`,
                animation: 'shimmer 3s infinite'
              }
            }}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    fontSize: '1.8rem',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    border: '3px solid white',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 12,
                      height: 12,
                      background: theme.palette.success.main,
                      borderRadius: '50%',
                      border: '2px solid white',
                      animation: 'pulse 2s infinite'
                    }
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </Avatar>
              </motion.div>
              
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {profile.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                {profile.role}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip 
                    icon={<StarIcon sx={{ fontSize: '16px' }} />}
                    label={`${stats.rating.toFixed(1)}⭐`} 
                    color="primary" 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip 
                    icon={<CheckIcon sx={{ fontSize: '16px' }} />}
                    label={`${stats.completedBookings}`} 
                    color="success" 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </motion.div>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip 
                    icon={<TrendingUpIcon sx={{ fontSize: '14px' }} />}
                    label={`${stats.completionRate}%`}
                    color="info"
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Navigation Menu - Vertically Aligned */}
          <Box sx={{ mb: 3, mt: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 3, 
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <MenuIcon sx={{ fontSize: '20px' }} />
                Navigation
              </Typography>
            </motion.div>
            
            <List sx={{ mb: 3 }}>
            {[
              { icon: <PersonIcon />, text: 'Profile', tab: 0, color: 'primary' },
              { icon: <CalendarIcon />, text: 'Availability', tab: 1, color: 'secondary' },
              { icon: <ScheduleIcon />, text: 'Schedule', tab: 2, color: 'success' },
              { icon: <AssignmentIcon />, text: 'Bookings', tab: 3, color: 'warning' },
              { icon: <NotificationsIcon />, text: 'Notifications', tab: 4, color: 'info' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ListItem
                  disablePadding
                  sx={{ mb: 1.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ListItemButton
                      onClick={() => {
                        console.log('Navigation clicked - Setting tab to:', item.tab, 'Text:', item.text);
                        setActiveTab(item.tab);
                      }}
                      sx={{
                        borderRadius: 3,
                        minHeight: 56,
                        px: 2,
                        background: activeTab === item.tab 
                          ? `linear-gradient(135deg, 
                              ${alpha(theme.palette[item.color].main, 0.25)}, 
                              ${alpha(theme.palette[item.color].dark, 0.15)})` 
                          : 'transparent',
                        border: activeTab === item.tab 
                          ? `2px solid ${alpha(theme.palette[item.color].main, 0.4)}` 
                          : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, 
                              ${alpha(theme.palette[item.color].main, 0.15)}, 
                              ${alpha(theme.palette[item.color].dark, 0.08)})`,
                          transform: 'translateX(4px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': activeTab === item.tab ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          background: `linear-gradient(180deg, ${theme.palette[item.color].main}, ${theme.palette[item.color].dark})`,
                        } : {}
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: activeTab === item.tab ? theme.palette[item.color].main : 'inherit',
                        minWidth: 40,
                        '& svg': {
                          fontSize: '22px'
                        }
                      }}>
                        <motion.div
                          animate={activeTab === item.tab ? {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: activeTab === item.tab ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {item.icon}
                        </motion.div>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: activeTab === item.tab ? 'bold' : '600',
                            color: activeTab === item.tab ? theme.palette[item.color].main : 'inherit',
                            fontSize: '0.95rem'
                          }
                        }}
                      />
                      {activeTab === item.tab && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: theme.palette[item.color].main,
                              boxShadow: `0 0 12px ${alpha(theme.palette[item.color].main, 0.6)}`
                            }}
                          />
                        </motion.div>
                      )}
                    </ListItemButton>
                  </motion.div>
                </ListItem>
              </motion.div>
            ))}
          </List>
          </Box>

          {/* Quick Actions Section - Vertically Aligned */}
          <Box sx={{ mb: 3, mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 2, 
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <FlashOnIcon sx={{ fontSize: '20px' }} />
                Quick Actions
              </Typography>
            </motion.div>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { icon: <CalendarIcon />, text: 'Set Availability', action: 'availability', color: 'secondary' },
                { icon: <AssignmentIcon />, text: 'View Bookings', action: 'bookings', color: 'warning' },
                { icon: <NotificationsIcon />, text: 'Check Notifications', action: 'notifications', color: 'info' },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleQuickAction(action.action)}
                    startIcon={action.icon}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette[action.color].main, 0.3),
                      color: theme.palette[action.color].main,
                      background: alpha(theme.palette[action.color].main, 0.05),
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette[action.color].main, 0.15)}, ${alpha(theme.palette[action.color].dark, 0.08)})`,
                        borderColor: theme.palette[action.color].main,
                        transform: 'translateX(4px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette[action.color].main, 0.2)}`
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontWeight: '600'
                    }}
                  >
                    {action.text}
                  </Button>
                </motion.div>
              ))}
            </Box>
            </Box>

          {/* Quick Stats */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
              Quick Stats
            </Typography>
          <Box sx={{ 
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {stats.totalBookings}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {stats.completionRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {stats.responseTime}h
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Response Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {stats.activeProjects}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: `linear-gradient(180deg, 
              ${alpha(theme.palette.primary.main, 0.08)} 0%, 
              ${alpha(theme.palette.primary.dark, 0.05)} 50%, 
              ${alpha(theme.palette.background.default, 0.95)} 100%)`,
            borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 1300
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Mobile Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ 
              textAlign: 'center',
              mb: 3,
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.primary.main, 0.15)}, 
                ${alpha(theme.palette.secondary.main, 0.1)})`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Avatar 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  fontSize: '1.3rem',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '2px solid white'
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {profile.role}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<StarIcon sx={{ fontSize: '14px' }} />}
                  label={`${stats.rating.toFixed(1)}⭐`} 
                  color="primary" 
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white'
                  }}
                />
                <Chip 
                  icon={<CheckIcon sx={{ fontSize: '14px' }} />}
                  label={`${stats.completedBookings}`} 
                  color="success" 
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    color: 'white'
                  }}
                />
              </Box>
            </Box>
          </motion.div>

          {/* Mobile Navigation */}
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <MenuIcon sx={{ fontSize: '18px' }} />
            Navigation
          </Typography>
          <List>
            {[
              { icon: <PersonIcon />, text: 'Profile', tab: 0, color: 'primary' },
              { icon: <CalendarIcon />, text: 'Availability', tab: 1, color: 'secondary' },
              { icon: <ScheduleIcon />, text: 'Schedule', tab: 2, color: 'success' },
              { icon: <AssignmentIcon />, text: 'Bookings', tab: 3, color: 'warning' },
              { icon: <NotificationsIcon />, text: 'Notifications', tab: 4, color: 'info' },
            ].map((item, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ListItemButton 
                    onClick={() => { setActiveTab(item.tab); handleDrawerToggle(); }}
                    sx={{
                      borderRadius: 2,
                      background: activeTab === item.tab 
                        ? `linear-gradient(135deg, 
                            ${alpha(theme.palette[item.color].main, 0.25)}, 
                            ${alpha(theme.palette[item.color].dark, 0.15)})` 
                        : 'transparent',
                      border: activeTab === item.tab 
                        ? `2px solid ${alpha(theme.palette[item.color].main, 0.4)}` 
                        : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, 
                            ${alpha(theme.palette[item.color].main, 0.15)}, 
                            ${alpha(theme.palette[item.color].dark, 0.08)})`,
                        transform: 'translateX(2px)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: activeTab === item.tab ? theme.palette[item.color].main : 'inherit',
                      minWidth: 32
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: activeTab === item.tab ? 'bold' : '600',
                          color: activeTab === item.tab ? theme.palette[item.color].main : 'inherit',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItemButton>
                </motion.div>
              </ListItem>
            ))}
          </List>

          {/* Mobile Quick Actions */}
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FlashOnIcon sx={{ fontSize: '18px' }} />
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { icon: <CalendarIcon />, text: 'Set Availability', action: 'availability', color: 'secondary' },
              { icon: <AssignmentIcon />, text: 'View Bookings', action: 'bookings', color: 'warning' },
              { icon: <NotificationsIcon />, text: 'Check Notifications', action: 'notifications', color: 'info' },
            ].map((action, index) => (
              <Button
                key={index}
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => { handleQuickAction(action.action); handleDrawerToggle(); }}
                startIcon={action.icon}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  px: 1.5,
                  borderRadius: 2,
                  borderColor: alpha(theme.palette[action.color].main, 0.3),
                  color: theme.palette[action.color].main,
                  background: alpha(theme.palette[action.color].main, 0.05),
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(theme.palette[action.color].main, 0.15)}, ${alpha(theme.palette[action.color].dark, 0.08)})`,
                    borderColor: theme.palette[action.color].main,
                    transform: 'translateX(2px)'
                  },
                  fontWeight: '600'
                }}
              >
                {action.text}
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area - Adjusted for Fixed Sidebar */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: { sm: `calc(100% - 300px)` },
          ml: { sm: '300px' },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>

        {/* Enhanced Statistics Cards with Progress */}
        <Box sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              📊 Your Performance Overview
              {liveMode && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Chip 
                    icon={<WhatshotIcon />}
                    label="LIVE UPDATES" 
                    color="error" 
                    size="small"
                    sx={{ 
                      ml: 2,
                      animation: 'pulse 1.5s infinite',
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[4]
                    }}
                  />
                </motion.div>
              )}
            </Typography>
          </motion.div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Bookings"
                value={stats.totalBookings}
                icon={<AssignmentIcon />}
                color="primary"
                subtitle="All time assignments"
                trend={12}
                index={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={<CheckIcon />}
                color="success"
                subtitle="Successfully delivered"
                trend={8}
                progress={stats.completionRate}
                index={1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Client Satisfaction"
                value={`${stats.clientSatisfaction}%`}
                icon={<StarIcon />}
                color="warning"
                subtitle="Average rating"
                trend={5}
                progress={stats.clientSatisfaction}
                index={2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Earnings"
                value={stats.earnings}
                icon={<PaymentIcon />}
                color="secondary"
                subtitle="Lifetime revenue"
                trend={15}
                index={3}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Advanced Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                background: 'white',
                borderRadius: 3,
                boxShadow: showShadows ? theme.shadows[4] : 'none',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  animation: liveMode ? 'slide 3s infinite' : 'none'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📈 Performance Metrics
                    {dataVisualization && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ display: 'inline-block', ml: 2 }}
                      >
                        <BubbleChartIcon sx={{ color: theme.palette.primary.main }} />
                      </motion.div>
                    )}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(theme.palette.primary.main, 0.1) }}>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              transition: { duration: 2, repeat: Infinity }
                            }}
                          >
                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                              {stats.responseTime}h
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Avg Response Time
                            </Typography>
                          </motion.div>
                        </Box>
                      </motion.div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <motion.div
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(theme.palette.success.main, 0.1) }}>
                          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {stats.activeProjects}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Active Projects
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <motion.div
                        whileHover={{ scale: 1.1, x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(theme.palette.warning.main, 0.1) }}>
                          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                            {stats.totalClients}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Clients
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(theme.palette.info.main, 0.1) }}>
                          <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                            {stats.repeatClients}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Repeat Clients
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <ActivityTimeline />
            </Grid>
          </Grid>
        </motion.div>

        {/* Achievements Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            🏆 Your Achievements
          </Typography>
          <Grid container spacing={2}>
            {achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                <AchievementCard achievement={achievement} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            🚀 Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CalendarIcon />}
                onClick={() => handleQuickAction('availability')}
                sx={{ 
                  py: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                Set Availability
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<AssignmentIcon />}
                onClick={() => handleQuickAction('bookings')}
                sx={{ 
                  py: 2,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                View Bookings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ScheduleIcon />}
                onClick={() => setActiveTab(2)}
                sx={{ 
                  py: 2,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                My Schedule
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<NotificationsIcon />}
                onClick={() => handleQuickAction('notifications')}
                sx={{ 
                  py: 2,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                Notifications
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Activity Alert */}
        {refreshing && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Refreshing Dashboard</AlertTitle>
            Updating your latest information...
            <LinearProgress sx={{ mt: 1 }} />
          </Alert>
        )}

        {/* Enhanced Tabs */}
        <Box sx={{ 
          mb: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: theme.shadows[4]
        }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="staff dashboard tabs"
            sx={{ 
              '& .MuiTabs-indicator': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                height: 4,
                borderRadius: 2
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 60,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-2px)'
                }
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<PersonIcon />}
              label="Profile"
              sx={{ 
                '& .MuiTab-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
            <Tab 
              icon={<CalendarIcon />}
              label="Availability"
              sx={{ 
                '& .MuiTab-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
            <Tab 
              icon={<ScheduleIcon />}
              label="Schedule"
              sx={{ 
                '& .MuiTab-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
            <Tab 
              icon={<AssignmentIcon />}
              label="My Bookings"
              sx={{ 
                '& .MuiTab-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
            <Tab 
              icon={<NotificationsIcon />}
              label="Notifications"
              sx={{ 
                '& .MuiTab-label': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            />
          </Tabs>
        </Box>

        {/* Enhanced Profile Tab */}
        {activeTab === 0 && (
          <>
            {console.log('🔍 Rendering Profile Tab - activeTab:', activeTab)}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <Card sx={{ 
              background: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[12]
              }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    👤 Staff Profile
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      console.log('🔧 Staff Edit button clicked, current isEditing:', isEditing);
                      setIsEditing(!isEditing);
                    }}
                    startIcon={isEditing ? <ZoomInIcon /> : <EditIcon />}
                    sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    {isEditing ? 'View Mode' : 'Edit Profile'}
                  </Button>
                </Box>

                <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        value={profile.role}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <AssignmentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={profile.department}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Skills"
                        name="skills"
                        value={profile.skills.join(', ')}
                        onChange={(e) => setProfile(prev => ({...prev, skills: e.target.value.split(',').map(s => s.trim())}))}
                        disabled={!isEditing}
                        helperText="Separate multiple skills with commas"
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
                        }}
                        InputProps={{
                          startAdornment: <StarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                        sx={{ 
                          background: alpha(theme.palette.grey[500], 0.1),
                          '&:hover': {
                            background: alpha(theme.palette.grey[500], 0.2)
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<CheckIcon />}
                        sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          minWidth: 120,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
          </>
        )}

        {/* Enhanced Availability Calendar Tab */}
        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[12]
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <AvailabilityCalendar />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Schedule View Tab */}
        {activeTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {console.log('Rendering Schedule View Tab - activeTab:', activeTab)}
            <Card sx={{ 
              background: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[12]
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <ScheduleView />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enhanced My Bookings Tab */}
        {activeTab === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[12]
              }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    📋 My Assigned Bookings
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${userBookings.length} Total`} 
                      color="primary" 
                      size="small"
                    />
                    <Chip 
                      label={`${userBookings.filter(b => b.status === 'confirmed').length} Confirmed`} 
                      color="success" 
                      size="small"
                    />
                    <Chip 
                      label={`${userBookings.filter(b => b.status === 'pending').length} Pending`} 
                      color="warning" 
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Search and Filters */}
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          background: alpha(theme.palette.background.paper, 0.8)
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <FormControlLabel
                        control={
                          <Select
                            value={filterStatus}
                            onChange={handleFilterChange}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                          </Select>
                        }
                        label="Filter"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <FormControlLabel
                        control={
                          <Select
                            value={sortBy}
                            onChange={handleSortChange}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="amount">Amount</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                          </Select>
                        }
                        label="Sort By"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        size="small"
                        sx={{ justifyContent: 'center' }}
                      >
                        <ToggleButton value="grid">
                          <ViewModuleIcon />
                        </ToggleButton>
                        <ToggleButton value="list">
                          <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="timeline">
                          <ViewTimelineIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Box>

                {/* Bookings Display */}
                {viewMode === 'grid' && (
                  <Grid container spacing={2}>
                    {paginatedBookings.map((booking, index) => (
                      <Grid item xs={12} md={6} key={booking.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}
                            onClick={() => handleBookingClick(booking)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                  {booking.eventName}
                                </Typography>
                                <Chip
                                  label={booking.status}
                                  color={getStatusColor(booking.status)}
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                👤 {booking.customerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                📍 {booking.location}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  💰 ${booking.amount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  📅 {booking.date}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {viewMode === 'list' && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Event</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedBookings.map((booking) => (
                          <TableRow key={booking.id} hover>
                            <TableCell>{booking.eventName}</TableCell>
                            <TableCell>{booking.customerName}</TableCell>
                            <TableCell>{booking.location}</TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>${booking.amount}</TableCell>
                            <TableCell>
                              <Chip
                                label={booking.status}
                                color={getStatusColor(booking.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => handleBookingClick(booking)}>
                                <VisibilityIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {viewMode === 'timeline' && (
                  <Timeline sx={{ mt: 2 }}>
                    {paginatedBookings.map((booking) => (
                      <TimelineItem key={booking.id}>
                        <TimelineSeparator>
                          <TimelineDot color={getStatusColor(booking.status)}>
                            <EventIcon />
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Card sx={{ mb: 2 }}>
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                {booking.eventName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                👤 {booking.customerName} • 📍 {booking.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                📅 {booking.date} • 💰 ${booking.amount}
                              </Typography>
                              <Chip
                                label={booking.status}
                                color={getStatusColor(booking.status)}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </CardContent>
                          </Card>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}

                {/* Pagination */}
                {sortedBookings.length > 6 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(sortedBookings.length / 6)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Notifications Tab */}
        {activeTab === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[12]
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <NotificationSystem userRole="staff" />
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Speed Dial for Quick Actions */}
        <SpeedDial
          ariaLabel="SpeedDial quick actions"
          sx={{ 
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
          icon={<AddIcon />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
          direction="up"
        >
          <SpeedDialAction
            icon={<CalendarIcon />}
            tooltipTitle="Set Availability"
            onClick={() => { handleQuickAction('availability'); handleSpeedDialClose(); }}
          />
          <SpeedDialAction
            icon={<AssignmentIcon />}
            tooltipTitle="View Bookings"
            onClick={() => { handleQuickAction('bookings'); handleSpeedDialClose(); }}
          />
          <SpeedDialAction
            icon={<NotificationsIcon />}
            tooltipTitle="Notifications"
            onClick={() => { handleQuickAction('notifications'); handleSpeedDialClose(); }}
          />
          <SpeedDialAction
            icon={<SettingsIcon />}
            tooltipTitle="Settings"
            onClick={() => { handleQuickAction('settings'); handleSpeedDialClose(); }}
          />
        </SpeedDial>

        {/* Settings Dialog */}
        <Dialog 
          open={dialogOpen && !selectedBooking} 
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SettingsIcon />
              <Typography variant="h6">Dashboard Settings</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={handleDarkModeToggle}
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoRefresh}
                        onChange={handleAutoRefreshToggle}
                        color="primary"
                      />
                    }
                    label="Auto Refresh"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={soundEnabled}
                        onChange={handleSoundToggle}
                        color="primary"
                      />
                    }
                    label="Sound Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={() => {
                          setEmailNotifications(!emailNotifications);
                          toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
                        }}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Booking Details Dialog */}
        <Dialog 
          open={dialogOpen && selectedBooking} 
          onClose={handleDialogClose}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssignmentIcon />
                <Typography variant="h6">Booking Details</Typography>
              </Box>
              <Chip
                label={selectedBooking?.status}
                color={selectedBooking ? getStatusColor(selectedBooking.status) : 'default'}
                size="small"
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ py: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Event Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedBooking.eventName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {selectedBooking.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📅 {selectedBooking.date} at {selectedBooking.time}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Customer Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedBooking.customerName}
                      </Typography>
                      {selectedBooking.customerRating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Rating value={selectedBooking.customerRating} readOnly size="small" />
                          <Typography variant="body2">({selectedBooking.customerRating})</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Services
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedBooking.services.map((service, idx) => (
                        <Chip
                          key={idx}
                          label={service}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Payment
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        💰 ${selectedBooking.amount}
                      </Typography>
                      <Chip
                        label={selectedBooking.paymentStatus}
                        color={getPaymentStatusColor(selectedBooking.paymentStatus)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  {selectedBooking.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Notes
                      </Typography>
                      <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <Typography variant="body2">
                          {selectedBooking.notes}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            <Button variant="contained" startIcon={<EditIcon />}>Edit Booking</Button>
          </DialogActions>
        </Dialog>
        </Container>
      </Box>
    </div>
  );
};

export default StaffDashboard;
