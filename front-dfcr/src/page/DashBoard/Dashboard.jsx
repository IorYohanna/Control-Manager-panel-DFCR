import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Service from "./Service";
import { TrendingUp } from "lucide-react";

const idServices = ['SAGA', 'SF', 'SRFP', 'SCRI', 'SPSE'];

const Dashboard = () => {
  const [activeService, setActiveService] = useState(idServices[0]);
  const { sidebarExpanded } = useOutletContext();

  return (
    <div className="min-h-screen">
      
      {/* HEADER HERO - Sticky & Elegant */}
      <div className="sticky top-0 z-40 mx-3 sm:mx-5 mt-3 sm:mt-5 mb-5">
        <div className="bg-gradient-to-r from-[#2d466e] via-[#34547a] to-[#2d466e] rounded-xl sm:rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm">
          <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4">
            
            {/* Single Row Layout - More compact */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              
              {/* LEFT : LOGO + TITRE */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">Dashboard</h1>
                  <p className="text-blue-100/70 text-[10px] sm:text-xs font-medium leading-tight">
                    Gestion des services
                  </p>
                </div>
              </div>

              {/* CENTER : NAVIGATION SERVICES - Compact */}
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md rounded-lg px-1.5 py-1.5 border border-white/10">
                {idServices.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveService(s)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] sm:text-xs tracking-wide transition-all duration-300 whitespace-nowrap ${
                      activeService === s
                        ? "bg-white text-[#2d466e] shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* RIGHT : DATE - Minimalist */}
              <div className="hidden lg:flex items-center">
                <div className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <p className="text-white/90 text-xs font-medium whitespace-nowrap">
                    {new Date().toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SERVICE CONTENT */}
      <div className="px-3 sm:px-5 pb-5">
        <Service activeService={activeService} />
      </div>
      
    </div>
  );
};

export default Dashboard;