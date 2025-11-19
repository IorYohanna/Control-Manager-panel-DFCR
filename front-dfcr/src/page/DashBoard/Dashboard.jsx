import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Service from "./Service";
const idServices = ['SAGA', 'SF', 'SRFP', 'SCRI', 'SPSE'];

const Dashboard = () => {
  const [activeService, setActiveService] = useState(idServices[0]);
  // eslint-disable-next-line no-unused-vars
  const { sidebarExpanded } = useOutletContext();

  return (
    <div className=" bg-linear-to-b from-white/50 to-white/30 overflow-y-auto w-full thin-scrollbar ">
      
      {/* HEADER HERO - Sticky & Elegant */}
      <div className="sticky top-0 z-40 mx-3 sm:mx-5 mt-3 sm:mt-5 mb-5">
        <div className="rounded-2xl bg-white/50 shadow-lg border border-white/10 backdrop-blur-sm px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5">
          
          {/* Single Row Layout - More compact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* LEFT : LOGO + TITRE */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="min-w-0">
                <h1 className=" sm:text-lg lg:text-3xl font-dropline font-bold text-black tracking-wider">Bien le bonjour!</h1>
              </div>
            </div>

            {/* CENTER : NAVIGATION SERVICES - Compact */}
            <div className="flex items-center gap-1.5 bg-[#2d466e] backdrop-blur-md rounded-4xl px-1.5 py-1.5 border border-white/10">
              {idServices.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveService(s)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-2xl font-semibold text-[10px] sm:text-xs tracking-wide whitespace-nowrap ${
                    activeService === s
                      ? "bg-[#f5ece3] text-[#2d466e] shadow-md"
                      : "text-white/80 hover:text-white hover:bg-[#f5ece3]/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* RIGHT : DATE - Minimalist */}
            <div className="hidden lg:flex items-center">
              <div className="px-3 sm:px-4 py-1.5 sm:py-3 bg-white backdrop-blur-sm rounded-4xl border border-white/10 hover:bg-white/10">
                <p className="text-black text-xs font-medium whitespace-nowrap">
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

      {/* SERVICE CONTENT */}
      <div>
        <Service activeService={activeService} />
      </div>
      
    </div>
  );
};

export default Dashboard;