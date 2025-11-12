// workflow.js
const API_BASE = 'http://localhost:8080';

export const fetchDocuments = async () => {
  const res = await fetch(`${API_BASE}/documents`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(res)
  return res.json();
};

export const fetchServices = async () => {
  const res = await fetch(`${API_BASE}/services`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(res.json())
  return res.json();
};

export const fetchEmployes = async () => {
  const res = await fetch(`${API_BASE}/users`,{
    method: 'GET',
    headers : { 'Content-Type': 'application/json'}
  });
  console.log(res.json())
  return res.json();
};

export const fetchWorkflowHistory = async (reference) => {
  const res = await fetch(`${API_BASE}/workflow/history/${reference}`);
  return res.json();
};

export const sendToService = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/send-to-service`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const assignToEmploye = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/assign-to-employe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const startWork = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/start-work`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const finishWork = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/finish-work`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const chefValidate = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/chef-validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const chefReject = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/chef-reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const directeurValidateComplet = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/directeur-validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const directeurRejectIncomplet = async (payload) => {
  const res = await fetch(`${API_BASE}/workflow/directeur-reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};
