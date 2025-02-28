import React, { useState, useEffect } from 'react';
import { Users, Calendar, Shield, Settings, Bell, BarChart, UserPlus, FileText, Check, X, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function AdminDashboard() {
  const { profile } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
    const fetchEvents = async () => {
      setIsLoading(true);
      
      try {
        const [pendingEventsData, allEventsData] = await Promise.all([
          eventService.getPendingEvents(),
          eventService.getAllEvents()
        ]);
        
        setPendingEvents(pendingEventsData);
        setAllEvents(allEventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleApproval = async (eventId: string, approved: boolean) => {
    if (!profile?.id) return;
    
    try {
      setActionError(null);
      const success = await eventService.updateEventStatus(
        eventId,
        approved ? 'approved' : 'rejected',
        profile.id,
        approved ? 'Event approved by admin' : 'Event rejected by admin'
      );
      
      if (success) {
        // Remove the approved/rejected item from the pending list
        setPendingEvents(prev => prev.filter(item => item.id !== eventId));
        
        // Update the event status in the all events list
        setAllEvents(prev => prev.map(item => 
          item.id === eventId 
            ? { ...item, status: approved ? 'approved' : 'rejected' } 
            : item
        ));
        
        // Add a success message
        setActionSuccess({
          type: approved ? 'approve' : 'reject',
          message: `Event ${approved ? 'approved' : 'rejected'} successfully.`
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating event status:', err);
      setActionError('Failed to update event status. Please try again.');
    }
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    
    try {
      setActionError(null);
      const { success, error } = await eventService.deleteEvent(selectedEvent.id);
      
      if (!success || error) {
        console.error('Error deleting event:', error);
        setActionError('Failed to delete event. Please try again.');
        return;
      }
      
      // Remove the event from both lists
      setPendingEvents(prev => prev.filter(item => item.id !== selectedEvent.id));
      setAllEvents(prev => prev.filter(item => item.id !== selectedEvent.id));
      
      setActionSuccess({
        type: 'delete',
        message: 'Event deleted successfully.'
      });
      
      // Close modal
      setShowDeleteConfirmModal(false);
      setSelectedEvent(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting event:', err);
      setActionError('An unexpected error occurred. Please try again.');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System overview and management</p>
        </div>

        {/* Success Message */}
        {actionSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{actionSuccess.message}</span>
          </div>
        )}

        {/* Error Message */}
        {actionError && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{actionError}</span>
          </div>
        )}

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
          {/* Events Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Events Management</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    activeTab === 'pending'
                      ? 'bg-[#f14621] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending Approvals
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    activeTab === 'all'
                      ? 'bg-[#f14621] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Events
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f14621]"></div>
              </div>
            ) : activeTab === 'pending' ? (
              pendingEvents.length === 0 ? (
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
              )
            ) : (
              allEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No events found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allEvents.map(event => (
                    <div key={event.id} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-sm capitalize ${getStatusClass(event.status)}`}>
                            {event.status}
                          </span>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Category:</span> {event.category}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Organizer:</span> {event.organizer_name}
                      </p>
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {event.status === 'rejected' && (
                          <button 
                            onClick={() => handleApproval(event.id, true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                        )}
                        {event.status === 'approved' && (
                          <button 
                            onClick={() => handleApproval(event.id, false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Confirm Delete</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{selectedEvent.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}