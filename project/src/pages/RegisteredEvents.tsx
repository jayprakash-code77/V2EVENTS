import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Download, ExternalLink, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];
type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];

export function RegisteredEvents() {
  const { user, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<{ event: Event; registration: EventRegistration }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const userRegistrations = await eventService.getUserRegistrations(user.id);
      setRegistrations(userRegistrations);
      setIsLoading(false);
    };

    if (isAuthenticated) {
      fetchRegistrations();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const upcomingEvents = registrations.filter(
    reg => new Date(reg.event.date) >= new Date()
  );
  
  const pastEvents = registrations.filter(
    reg => new Date(reg.event.date) < new Date()
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900">Sign In Required</h2>
          <p className="mt-2 text-gray-600">You need to sign in to view your registered events.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="bg-[#f14621] text-white px-6 py-3 rounded-xl hover:bg-[#d13d1b] transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#f14621] animate-spin" />
          <p className="mt-4 text-gray-600">Loading your registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Registered events"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              My Registered Events
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Track your upcoming events and access tickets and certificates
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 mb-6">You haven't registered for any upcoming events yet.</p>
              <Link 
                to="/events"
                className="inline-block bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(({ event, registration }) => (
                <div key={registration.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-40 relative">
                    <img 
                      src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-[#f14621]">{event.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-[#f14621]" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-[#f14621]" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#f14621]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Ticket ID:</span>
                        <span className="text-sm text-gray-600">{registration.ticket_id}</span>
                      </div>
                      <div className="flex justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${registration.ticket_id}`} 
                          alt="QR Code" 
                          className="w-24 h-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-[#f14621] text-white px-4 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Ticket
                      </button>
                      <Link 
                        to={`/events/register/${event.id}`}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Past Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
          
          {pastEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Events</h3>
              <p className="text-gray-600">You haven't attended any events yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(({ event, registration }) => (
                <div key={registration.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-40 relative">
                    <img 
                      src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-[#f14621]" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#f14621]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}