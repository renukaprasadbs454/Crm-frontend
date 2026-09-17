import api from './api.js';

// ── Authentication ──────────────────────────────────────────────────

export async function listLoginCompanies(search = '') {
  const { data } = await api.get('/auth/companies', { params: search ? { search } : {} });
  return data.data;
}

export async function loginWithPassword(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
}

export async function requestLoginOtp(payload) {
  const { data } = await api.post('/auth/login/request-otp', payload);
  return data.data;
}

export async function verifyLoginOtp(payload) {
  const { data } = await api.post('/auth/login/verify-otp', payload);
  return data.data;
}

// ── Signup ────────────────────────────────────────────────────────────
export async function registerSolo(payload) {
  const { data } = await api.post('/auth/register/solo', payload);
  return data.data;
}

export async function registerCompany(payload) {
  const { data } = await api.post('/auth/register/company', payload);
  return data.data;
}

export async function createSignupOrder(planTier) {
  const { data } = await api.post('/auth/register/order', { planTier });
  return data.data;
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Razorpay Checkout'));
    document.body.appendChild(script);
  });
}

export async function payForSignup(planTier, prefill) {
  const order = await createSignupOrder(planTier);
  if (order.free) return {};
  await loadRazorpay();
  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Skill99 CRM',
      description: `${order.plan.name} monthly subscription`,
      order_id: order.orderId,
      prefill,
      handler: (response) => resolve({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      }),
      modal: { ondismiss: () => reject(new Error('Payment was cancelled')) },
    });
    checkout.open();
  });
}

export async function checkoutSubscription(payload) {
  const { data } = await api.post('/subscription/checkout', payload);
  return data.data;
}

export async function listPublicPlans() {
  const { data } = await api.get('/public/plans');
  return data.data;
}

// ── Company Owner / TL dashboards ────────────────────────────────────
export async function getCompanyDashboard() {
  const { data } = await api.get('/company/dashboard');
  return data.data;
}

export async function getTLDashboard() {
  const { data } = await api.get('/company/tl-dashboard');
  return data.data;
}

// ── Team member management ───────────────────────────────────────────
export async function listMembers() {
  const { data } = await api.get('/company/members');
  return data.data;
}

export async function addCompanyAdmin(payload) {
  const { data } = await api.post('/company/admins', payload);
  return data.data;
}

export async function addTeamLead(payload) {
  const { data } = await api.post('/company/team-leads', payload);
  return data.data;
}

export async function addSalesperson(payload) {
  const { data } = await api.post('/company/salespeople', payload);
  return data.data;
}

export async function updateMember(id, payload) {
  const { data } = await api.patch(`/company/members/${id}`, payload);
  return data.data;
}

export async function removeMember(id) {
  const { data } = await api.delete(`/company/members/${id}`);
  return data.data;
}

// ── Platform Admin (metadata/aggregates only — never CRM records) ───────
export async function getPlatformOverview() {
  const { data } = await api.get('/admin/overview');
  return data.data;
}

export async function listCompanies(params = {}) {
  const { data } = await api.get('/admin/companies', { params });
  return data.data;
}

export async function getCompanyMetadata(id) {
  const { data } = await api.get(`/admin/companies/${id}`);
  return data.data;
}

export async function platformCreateCompany(payload) {
  const { data } = await api.post('/admin/companies', payload);
  return data.data;
}

export async function updateCompanyStatus(id, status) {
  const { data } = await api.patch(`/admin/companies/${id}/status`, { status });
  return data.data;
}

export async function listPlans() {
  const { data } = await api.get('/admin/plans');
  return data.data;
}

export async function updatePlan(tier, payload) {
  const { data } = await api.patch(`/admin/plans/${tier}`, payload);
  return data.data;
}

export async function deletePlan(tier) {
  const { data } = await api.delete(`/admin/plans/${tier}`);
  return data.data;
}

export async function createPlan(payload) {
  const { data } = await api.post('/admin/plans', payload);
  return data.data;
}

// ── WhatsApp OTP member activation ─────────────────────────────────────
export async function requestActivationOtp(identifier, channel = 'whatsapp') {
  const { data } = await api.post('/auth/activation/request-otp', { identifier, channel });
  return data.data;
}

export async function verifyActivationOtp(identifier, otp, channel = 'whatsapp') {
  const { data } = await api.post('/auth/activation/verify-otp', { identifier, otp, channel });
  return data.data;
}

export async function setActivationPassword(setupToken, password) {
  const { data } = await api.post('/auth/activation/set-password', { setupToken, password });
  return data.data;
}

export async function resendMemberOtp(id) {
  const { data } = await api.post(`/company/members/${id}/resend-otp`);
  return data.data;
}

export async function listFreelancers() {
  const { data } = await api.get('/admin/freelancers');
  return data.data;
}

export async function platformCreateSolo(payload) {
  const { data } = await api.post('/admin/freelancers', payload);
  return data.data;
}

export async function updateCompanySubscription(id, payload) {
  const { data } = await api.patch(`/admin/companies/${id}/subscription`, payload);
  return data.data;
}

export async function deleteCompanySubscription(id) {
  const { data } = await api.delete(`/admin/companies/${id}/subscription`);
  return data.data;
}

export async function updatePlatformCompany(id, payload) {
  const { data } = await api.patch(`/admin/companies/${id}`, payload);
  return data.data;
}

export async function deletePlatformCompany(id) {
  const { data } = await api.delete(`/admin/companies/${id}`);
  return data.data;
}

export async function updateSoloSubscription(id, payload) {
  const { data } = await api.patch(`/admin/freelancers/${id}/subscription`, payload);
  return data.data;
}

export async function deleteSoloSubscription(id) {
  const { data } = await api.delete(`/admin/freelancers/${id}/subscription`);
  return data.data;
}

export async function updateSoloStatus(id, isActive) {
  const { data } = await api.patch(`/admin/freelancers/${id}/status`, { isActive });
  return data.data;
}

export async function updatePlatformSolo(id, payload) {
  const { data } = await api.patch(`/admin/freelancers/${id}`, payload);
  return data.data;
}

export async function deletePlatformSolo(id) {
  const { data } = await api.delete(`/admin/freelancers/${id}`);
  return data.data;
}

// ── Password reset: choose WhatsApp or email OTP ────────────────────────
export async function requestPasswordReset(payload) {
  const { data } = await api.post('/auth/password-reset/request', payload);
  return data.data;
}

export async function verifyPasswordReset(payload) {
  const { data } = await api.post('/auth/password-reset/verify-otp', payload);
  return data.data;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/auth/password-reset/reset', payload);
  return data.data;
}
