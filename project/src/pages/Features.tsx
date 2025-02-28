import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Bell, MessageSquare, Settings, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'User Roles & Authentication',
    description: 'Secure access for students, faculty, and admins with role-specific dashboards',
    icon: Users,
    details: [
      'Role-based access control',
      'Secure authentication system',
      'Custom permissions management',
      'User profile customization'
    ],
    link: '/dashboard/student' // Default to student dashboard
  },
  {
    title: 'Event Discovery',
    description: 'Find and filter events by category with our intuitive calendar view',
    icon: Calendar,
    details: [
      'Advanced search and filtering',
      'Category-based organization',
      'Interactive calendar interface',
      'Personalized recommendations'
    ],
    link: '/events'
  },
  {
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications and event reminders',
    icon: Bell,
    details: [
      'Push notifications',
      'Email alerts',
      'Custom reminder settings',
      'Event updates and changes'
    ]
  },
  {
    title: 'Interactive Forum',
    description: 'Engage in discussions and connect with event organizers',
    icon: MessageSquare,
    details: [
      'Discussion threads',
      'Direct messaging',
      'Q&A sessions',
      'Community engagement tools'
    ]
  },
  {
    title: 'Admin Control',
    description: 'Comprehensive tools for event management and analytics',
    icon: Settings,
    details: [
      'Event analytics dashboard',
      'Attendee management',
      'Resource allocation',
      'Performance metrics'
    ],
    link: '/dashboard/admin'
  },
  {
    title: 'Easy Registration',
    description: 'One-click registration with digital tickets and QR codes',
    icon: CheckCircle,
    details: [
      'Quick registration process',
      'Digital ticket generation',
      'QR code check-in',
      'Attendance tracking'
    ]
  }
];

export function Features() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="College event features"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Powerful Features for Seamless Events
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Discover all the tools and features that make VidyalankarEvents the perfect platform for managing and experiencing college events.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-[#f14621]/10 rounded-xl">
                    <feature.icon className="w-8 h-8 text-[#f14621]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">{feature.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-4 mb-6">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <ArrowRight className="w-5 h-5 text-[#f14621] mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {feature.link && (
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-[#f14621] font-medium hover:text-[#d13d1b] transition-colors"
                  >
                    Try it now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-400">
              Join thousands of students and faculty members already using VidyalankarEvents
            </p>
            <Link 
              to="/signup"
              className="inline-block mt-8 bg-[#f14621] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#d13d1b] transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}