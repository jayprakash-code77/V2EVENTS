import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, BarChart, Bell, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function FacultyDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    capacity: '',
    price: 'Free',
    image_url: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [managedEvents, setManagedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (profile?.id) {
        setIsLoading(true);
        const events = await eventService.getFacultyEvents(profile.id);
        setManagedEvents(events);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [profile]);

  const recentActivities = [
    { id: 1, type: 'Registration', message: 'New student registered for Advanced Web Development', time: '2 hours ago' },
    { id: 2, type: 'Update', message: 'Updated Cloud Computing Workshop details', time: '5 hours ago' },
    { id: 3, type: 'Feedback', message: 'Received 5 new feedback submissions', time: '1 day ago' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      const { data, error } = await eventService.createEvent({
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        category: eventForm.category,
        capacity: parseInt(eventForm.capacity),
        price: eventForm.price || 'Free',
        image_url: eventForm.image_url || null,
        organizer_id: profile.id,
        organizer_name: profile.name,
        organizer_contact: profile.contact || null
      });
      
      if (error) {
        console.error('Error creating event:', error);
        return;
      }
      
      setFormSubmitted(true);
      
      // Add the new event to the list
      if (data) {
        setManagedEvents(prev => [data, ...prev]);
      }
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormSubmitted(false);
        setShowCreateEventModal(false);
        setEventForm({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          category: '',
          capacity: '',
          price: 'Free',
          image_url: ''
        });
      }, 3000);
    } catch (err) {
      console.error('Error creating event:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your events and track student progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {managedEvents.filter(e => e.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Workshops</p>
                <p className="text-2xl font-bold text-gray-900">
                  {managedEvents.filter(e => e.category === 'Workshop').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <BarChart className="w-8 h-8 text-[#f14621]" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Managed Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Managed Events</h2>
              <button 
                onClick={() => setShowCreateEventModal(true)}
                className="px-4 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f14621]"></div>
              </div>
            ) : managedEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">You haven't created any events yet.</p>
                <button 
                  onClick={() => setShowCreateEventModal(true)}
                  className="mt-4 px-4 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {managedEvents.map(event => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusClass(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Capacity</span>
                        <span>{event.capacity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
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

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button 
                onClick={() => setShowCreateEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {formSubmitted ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Event Submitted for Approval</h3>
                <p className="text-gray-600 mb-4">
                  Your event has been submitted to the admin for approval. You will be notified once it's approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={eventForm.time}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={eventForm.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Academic">Academic</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={eventForm.capacity}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={eventForm.price}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      placeholder="Free or ₹XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image_url"
                      name="image_url"
                      value={eventForm.image_url}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateEventModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}