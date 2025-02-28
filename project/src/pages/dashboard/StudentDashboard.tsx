import React from 'react';
import { Calendar, BookOpen, Award, Bell, Clock, Users } from 'lucide-react';

export function StudentDashboard() {
  const upcomingEvents = [
    { id: 1, name: 'Tech Symposium 2025', date: '2025-03-15', time: '10:00 AM', type: 'Technical' },
    { id: 2, name: 'Cultural Fest', date: '2025-03-20', time: '11:30 AM', type: 'Cultural' }
  ];

  const enrolledEvents = [
    { id: 1, name: 'Web Development Workshop', progress: 60, nextSession: '2025-03-10 14:00' },
    { id: 2, name: 'AI/ML Bootcamp', progress: 30, nextSession: '2025-03-12 15:00' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, John Doe</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Registered Events</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hours Attended</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Communities</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#f14621]/10 text-[#f14621] rounded-full text-sm">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Events Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="space-y-6">
              {enrolledEvents.map(event => (
                <div key={event.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <span className="text-sm text-gray-600">{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#f14621] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${event.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Next session: {new Date(event.nextSession).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}