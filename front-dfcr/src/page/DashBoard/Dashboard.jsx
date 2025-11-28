import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Service from "./Service";
import NotificationWidget from "../../components/Notification/NotificationWidget";
import { API_BASE_URL, downloadDocument, getAuthHeader } from "../../api/Document/document";
import { RecentDocumentsWeekly } from "../../components/Dashboard/RecentDocumentsWeekly";

const idServices = ['SAGA', 'SF', 'SRFP', 'SCRI', 'SPSE'];

const Dashboard = () => {
  const [activeService, setActiveService] = useState(idServices[0]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingRef, setDownloadingRef] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { sidebarExpanded } = useOutletContext();

  useEffect(() => {
    loadAllDocuments();
  }, []);

  const loadAllDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Erreur chargement documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reference, event) => {
    event.stopPropagation();
    setDownloadingRef(reference);

    try {
      await downloadDocument(reference);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setDownloadingRef(null);
    }
  };

  return (
    <div className="overflow-y-auto w-full thin-scrollbar">
      <div className="sticky top-0 z-40 mx-3 sm:mx-5 mt-3 sm:mt-5 mb-5">
        <div className="rounded-lg bg-white/50 shadow-lg border border-white/10 backdrop-blur-sm px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">

            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="min-w-0">
                <h1 className="sm:text-lg lg:text-3xl font-dropline font-bold text-black tracking-wider">
                  Bien le bonjour!
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#2d466e] backdrop-blur-md rounded-lg px-1.5 py-1.5 border border-white/10">
              {idServices.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveService(s)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg font-semibold text-[10px] sm:text-xs tracking-wide whitespace-nowrap ${activeService === s
                    ? "bg-[#f5ece3] text-[#2d466e] shadow-md"
                    : "text-white/80 hover:text-white hover:bg-[#f5ece3]/10"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

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

      < div className=" flex flex-col mb-5 ">
        <Service activeService={activeService} />
        <div className="mx-8 overflow-y-auto">
          <RecentDocumentsWeekly
            documents={documents}
            downloadingRef={downloadingRef}
            onDownload={handleDownload}
            loading={loading}
          />
        </div>

      </div>



    </div>
  );
};

export default Dashboard;