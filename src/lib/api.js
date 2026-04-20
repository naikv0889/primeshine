import { supabase } from './supabase';

// --- Bookings ---

export const createBooking = async (booking) => {
  if (!supabase) return { data: { id: 'demo-' + Date.now() }, error: null };
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  return { data, error };
};

export const getBookings = async (userId) => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('bookings')
    .select('*, vehicles(make, model, year, color)')
    .eq('customer_id', userId)
    .order('scheduled_date', { ascending: false });
  return { data, error };
};

export const getAllBookings = async () => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(full_name, email, phone), vehicles(make, model, year, color)')
    .order('scheduled_date', { ascending: false });
  return { data, error };
};

export const updateBooking = async (id, updates) => {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
  return { data, error };
};

// --- Vehicles ---

export const getVehicles = async (userId) => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase.from('vehicles').select('*').eq('owner_id', userId).order('is_primary', { ascending: false });
  return { data, error };
};

export const createVehicle = async (vehicle) => {
  if (!supabase) return { data: { id: 'demo-' + Date.now() }, error: null };
  const { data, error } = await supabase.from('vehicles').insert(vehicle).select().single();
  return { data, error };
};

export const updateVehicle = async (id, updates) => {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().single();
  return { data, error };
};

export const deleteVehicle = async (id) => {
  if (!supabase) return { error: null };
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  return { error };
};

// --- Reviews ---

export const getReviews = async (userId) => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase.from('reviews').select('*, bookings(service_id, scheduled_date)').eq('customer_id', userId).order('created_at', { ascending: false });
  return { data, error };
};

export const getAllReviews = async () => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name), bookings(service_id, scheduled_date)')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createReview = async (review) => {
  if (!supabase) return { data: { id: 'demo-' + Date.now() }, error: null };
  const { data, error } = await supabase.from('reviews').insert(review).select().single();
  return { data, error };
};

// --- Customers (admin) ---

export const getCustomers = async () => {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('profiles')
    .select('*, bookings(count), reviews(count)')
    .order('created_at', { ascending: false });
  return { data, error };
};

// --- Contact messages ---

export const sendContactMessage = async (message) => {
  if (!supabase) return { data: { id: 'demo-' + Date.now() }, error: null };
  const { data, error } = await supabase.from('contact_messages').insert(message).select().single();
  return { data, error };
};

// --- Admin stats ---

export const getAdminStats = async () => {
  if (!supabase) return { data: null, error: null };
  const [bookings, customers, reviews, revenue] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('reviews').select('id, rating'),
    supabase.from('bookings').select('total').eq('status', 'completed'),
  ]);
  return {
    data: {
      totalBookings: bookings.count || 0,
      totalCustomers: customers.count || 0,
      avgRating: reviews.data?.length ? (reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length).toFixed(2) : '0',
      totalRevenue: revenue.data?.reduce((s, b) => s + (b.total || 0), 0) || 0,
    },
    error: null,
  };
};
