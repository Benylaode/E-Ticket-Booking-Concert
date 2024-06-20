/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ModalLogout from "@/components/ModalLogout";
import concertApi from "@/api/modules/concerts.api";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    const fetchEvents = async () => {
      const { response, error } = await concertApi.getAllConcerts();
      if (response) {
        const events = response;

        const now = new Date();
        const upcoming = events.filter(event => new Date(event.start_date) > now);
        const previous = events.filter(event => new Date(event.start_date) <= now);

        setUpcomingEvents(upcoming);
        setPreviousEvents(previous);

        console.log(upcoming);
        console.log(previous);
      } else {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents(); 
  }, [router]);

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const formattedStartDate = `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;

    return formattedStartDate.toUpperCase();
  };

  const truncateDescription = (description) => {
    if (description.length > 120) {
        return `${description.slice(0, 120)}...`;
    }
    return description;
  };

  const handleEventClick = (eventId) => {
    if(isLoggedIn){
      router.push(`/concert/detailbuy/${eventId}`);
    } else {
      router.push(`/concert/${eventId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setShowModal(false);
    router.push('/login');
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-6 border-b border-x-gray-50 flex justify-between items-center relative z-20">
        <div className="flex items-center">
          <img src="/images/logos/logo1.png" alt="Logo" className="w-5 h-5 mr-2" />
          <div className="text-2xl font-bold">E-Ticket Booking Concert</div>
        </div>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                className="bg-transparent border border-white py-2 px-4 rounded mr-4"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button
                className="bg-white text-purple-800 py-2 px-4 rounded"
                onClick={() => router.push('/register')}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
              >
                Logout
              </button>
              {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
              )}
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-14 text-center relative z-10">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Lorem Ipsum</h1>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button
            className="bg-white text-purple-800 mt-8 py-3 px-6 rounded"
            onClick={() => router.push('/tickets')}
          >
            Get Ticket
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {upcomingEvents.map(event => (
            <div key={event.concert_id} className="bg-white shadow-md rounded overflow-hidden" onClick={() => handleEventClick(event.concert_id)}>
            <img
                src={`${event.image_concert.replace('C:\\Users\\ASUS\\Documents\\Semester 4 Sisfo\\Pemrograman Web Lanjutan\\Tugas\\E-Ticket Booking Concert\\frontend\\public', '').replace(/\\/g, '/')}`}
                alt="Event"
                className="w-full h-48 object-center"
              />
            <div className="p-4">
              <div className="text-sm text-gray-500">{formatDateRange(event.start_date, event.end_date)}</div>
              <h3 className="text-xl font-bold">{event.nama}</h3>
              <p className="mt-2 text-gray-700">
                {truncateDescription(event.deskripsi)}
              </p>
            </div>
          </div>
          ))}
        </div>
      </section>

      {/* Previous Events Section */}
      <section className="py-16 px-8 bg-gray-100 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">Previous Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {previousEvents.map(event => (
          <div key={event.concert_id} className="bg-white shadow-md rounded overflow-hidden" onClick={() => handleEventClick(event.concert_id)}>
          <img src={`${event.image_concert.replace('C:\\Users\\ASUS\\Documents\\Semester 4 Sisfo\\Pemrograman Web Lanjutan\\Tugas\\E-Ticket Booking Concert\\frontend\\public', '').replace(/\\/g, '/')}`} alt="Event" className="w-full h-48 object-center" />
          <div className="p-4">
            <div className="text-sm text-gray-500">{formatDateRange(event.start_date, event.end_date)}</div>
            <h3 className="text-xl font-bold">{event.nama}</h3>
            <p className="mt-2 text-gray-700">
              {truncateDescription(event.deskripsi)}
            </p>
          </div>
        </div>
        ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8 text-center relative z-10">
        <div className="container mx-auto">
          <div className="mb-4">
            <div className="flex items-center justify-center">
              <img src="/images/logos/logo1.png" alt="Logo" className="w-5 h-5 mr-2" />
              <h3 className="text-2xl font-bold">E-Ticket Booking Concert</h3>
            </div>
            <p className="mt-5 max-w-lg mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="text-sm">
            &copy; 2024 E-Ticket Booking Concert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
