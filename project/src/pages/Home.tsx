import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell, MessageSquare, Settings, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'User Roles & Authentication',
    description: 'Secure access for students, faculty, and admins with role-specific dashboards',
    icon: Users
  },
  {
    title: 'Event Discovery',
    description: 'Find and filter events by category with our intuitive calendar view',
    icon: Calendar
  },
  {
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications and event reminders',
    icon: Bell
  },
  {
    title: 'Interactive Forum',
    description: 'Engage in discussions and connect with event organizers',
    icon: MessageSquare
  },
  {
    title: 'Admin Control',
    description: 'Comprehensive tools for event management and analytics',
    icon: Settings
  },
  {
    title: 'Easy Registration',
    description: 'One-click registration with digital tickets and QR codes',
    icon: CheckCircle
  }
];

const stats = [
  { label: 'Active Users', value: '5000+' },
  { label: 'Events Hosted', value: '500+' },
  { label: 'Success Rate', value: '99%' },
  { label: 'Downloads', value: '10K+' }
];

const upcomingEvents = [
  {
    date: '2025-03-15',
    title: 'Tech Symposium 2025',
    time: '10:00 AM',
    location: 'Main Auditorium',
    description: 'Annual technology showcase featuring student projects and industry speakers',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    date: '2025-03-20',
    title: 'Cultural Fest',
    time: '11:30 AM',
    location: 'College Ground',
    description: 'A celebration of diversity through music, dance, and art performances',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    date: '2025-03-25',
    title: 'Career Fair',
    time: '9:00 AM',
    location: 'Seminar Hall',
    description: 'Connect with top companies and explore career opportunities',
    image: 'https://images.unsplash.com/photo-1559587521-f4911e0ad803?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  }
];

export function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/10 rounded-lg"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const event = upcomingEvents.find(e => new Date(e.date).toDateString() === date.toDateString());
      
      days.push(
        <div key={day} className={`h-24 bg-gray-50/10 rounded-lg p-2 ${event ? 'ring-2 ring-[#f14621]' : ''}`}>
          <span className="text-sm font-medium text-gray-200">{day}</span>
          {event && (
            <div className="mt-1">
              <p className="text-xs font-semibold text-[#f14621]">{event.title}</p>
              <p className="text-xs text-gray-400">{event.time}</p>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + increment, 1));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#f14621] pt-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Students at college event"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Manage, Join & Experience College Events at Vidyalankar
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Your comprehensive platform for discovering, organizing, and participating in college events.
            Join the community and never miss out on what's happening on campus.
          </p>
          <div className="mt-10 flex space-x-4">
            <button className="bg-white text-[#f14621] px-8 py-3 rounded-xl font-medium hover:bg-[#eccec7] transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-[#f14621] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Calendar and Events Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Discover and participate in exciting events happening at Vidyalankar
            </p>
          </div>

          {/* Event Cards */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.title} className="group relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  </div>
                  <div className="relative p-6 flex flex-col h-full min-h-[300px] justify-end">
                    <div className="bg-[#f14621]/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm inline-block w-fit mb-3">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric'
                      })} • {event.time}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                    <div className="flex items-center text-white/80 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link 
                to="/events"
                className="bg-[#f14621] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#d13d1b] transition-colors backdrop-blur-sm bg-opacity-80 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore All Events
              </Link>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Event Calendar</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-xl font-medium text-white">
                  {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </span>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-400 font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {generateCalendarDays()}
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#f14621]"></div>
                <span className="ml-2 text-gray-400">Event Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-50/10"></div>
                <span className="ml-2 text-gray-400">No Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-[#eccec7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to manage college events
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to make event management seamless and engaging
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-[#f14621] w-12 h-12">
                  <feature.icon size={32} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#f14621]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-base text-[#eccec7]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}