import React, { useState, useEffect } from 'react';
import { Users, Calendar, Shield, Settings, Bell, BarChart, UserPlus, FileText, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function AdminDashboard() {
  const { profile } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const systemStats = {
    totalUsers: 2500,
    activeEvents: 45,
    departments: 8,
    averageRating: 4.7
  };

  const recentActivities = [
    { id: 1, type: 'User', message: 'New faculty account created', time: '1 hour ago' },
    { id: 2, type: 'Event', message: 'Technical Symposium 2025 approved', time: '3 hours ago' },
    { id: 3, type: 'System', message: 'Daily backup completed', time: '5 hours ago' }
  ];

  useEffect(() => {
    const fetchPendingEvents = async () => {
      setIsLoading(true);
      const events = await eventService.getPendingEvents();
      setPendingEvents(events);
      setIsLoading(false);
    };

    fetchPendingEvents();
  }, []);

  const handleApproval = async (eventId: string, approved: boolean) => {
    if (!profile?.id) return;
    
    try {
      const success = await eventService.updateEventStatus(
        eventId,
        approved ? 'approved' : 'rejected',
        profile.id,
        approved ? 'Event approved by admin' : 'Event rejected by admin'
      );
      
      if (success) {
        // Remove the approved/rejected item from the list
        setPendingEvents(prev => prev.filter(item => item.id !== eventId));
        
        // Add a new activity (in a real app, this would be handled by a context or state management)
        const event = pendingEvents.find(item => item.id === eventId);
        if (event) {
          console.log(`Event "${event.title}" ${approved ? 'approved' : 'rejected'}`);
        }
      }
    } catch (err) {
      console.error('Error updating event status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System overview and management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.departments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <BarChart className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <UserPlus className="w-5 h-5 text-[#f14621]" />
            <span>Add User</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-5 h-5 text-[#f14621]" />
            <span>Manage Events</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-5 h-5 text-[#f14621]" />
            <span>Generate Reports</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-5 h-5 text-[#f14621]" />
            <span>System Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Approvals</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f14621]"></div>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-600">All events have been reviewed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map(event => (
                  <div key={event.id} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-[#f14621]/10 text-[#f14621] rounded text-sm">
                          {event.category}
                        </span>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Organized by: {event.organizer_name} • Location: {event.location}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleApproval(event.id, true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproval(event.id, false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Activities</h2>
            <div className="space-y-6">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-[#f14621]/10 rounded-lg">
                    <Bell className="w-5 h-5 text-[#f14621]" />
                  </div>
                  <div>
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}