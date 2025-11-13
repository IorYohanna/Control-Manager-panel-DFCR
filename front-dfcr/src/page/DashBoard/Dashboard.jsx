import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Service from "./Service";
import { TrendingUp } from "lucide-react";

const idServices = ['SAGA', 'SF', 'SRFP', 'SCRI', 'SPSE'];

const Dashboard = () => {
  const [activeService, setActiveService] = useState(idServices[0]);
  const { sidebarExpanded } = useOutletContext();

  

  return (
    <div className=" overflow-auto p-5 ">

      {/* HEADER HERO */}
      <div className={`bg-gradient-to-br fixed from-[#2d466e] via-[#3d5680] to-[#2d466e] z-50 ${
              sidebarExpanded ? 'w-[75%]' : 'w-[89%]' 
            } rounded-xl m-2`}>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-7 py-5">

          {/* LEFT : LOGO + TITRE */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-[#f5ece3]/80 text-sm font-medium -mt-1">
                Gestion des services
              </p>
            </div>
          </div>

          {/* CENTER : NAVIGATION SERVICES */}
          <div className="w-full lg:w-auto">
            <div className="flex flex-wrap justify-start lg:justify-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-xl">
              {idServices.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveService(s)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                    activeService === s
                      ? "bg-white text-[#2d466e] shadow-lg scale-105"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT : DATE */}
          <div className="flex items-center">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <p className="text-white text-sm font-semibold text-center">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE CONTENT */}
      <div className=" rounded-2xl">
        <Service activeService={activeService} />
      </div>
      
    </div>
  );
};

export default Dashboard;
