import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, MapPin } from 'lucide-react';
import { eventService } from '../services/eventService';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

const categories = [
  'All Events',
  'Academic',
  'Cultural',
  'Sports',
  'Technical',
  'Workshop',
  'Seminar'
];

export function Events() {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All Events' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Function to generate tags from event data
  const generateTags = (event: Event) => {
    const tags = [event.category];
    
    if (event.price === 'Free') {
      tags.push('Free');
    } else {
      tags.push('Paid');
    }
    
    // Add more tags based on event properties
    if (new Date(event.date) < new Date()) {
      tags.push('Past');
    } else if (new Date(event.date).toDateString() === new Date().toDateString()) {
      tags.push('Today');
    } else {
      tags.push('Upcoming');
    }
    
    return tags;
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Events showcase"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Discover Events
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Find and participate in exciting events happening across campus
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-4 md:mt-0">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${selectedCategory === category
                        ? 'bg-[#f14621] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No events match your search for "${searchQuery}"`
                  : selectedCategory !== 'All Events'
                    ? `No ${selectedCategory} events available at the moment`
                    : 'There are no events available at the moment'}
              </p>
              {(searchQuery || selectedCategory !== 'All Events') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Events');
                  }}
                  className="px-4 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={event.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-[#f14621]">{event.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-6">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generateTags(event).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/events/register/${event.id}`}
                      className="mt-6 block w-full bg-[#f14621] text-white px-4 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors text-center"
                    >
                      Register Now
                    </Link>
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