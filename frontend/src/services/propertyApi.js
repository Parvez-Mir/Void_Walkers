import api from '../utils/api';

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    })
  );

export const listProperties = async (params = {}) => {
  const response = await api.get('/properties', { params: cleanParams(params) });
  return response.data.data;
};

export const getProperty = async (identifier) => {
  const response = await api.get(`/properties/${identifier}`);
  return response.data.data;
};

export const getNearbyProperties = async (identifier, params = {}) => {
  const response = await api.get(`/properties/${identifier}/nearby`, {
    params: cleanParams(params),
  });
  return response.data.data;
};

export const getPropertyMeta = async () => {
  const response = await api.get('/properties/meta/filters');
  return response.data.data;
};

export const bloomSearchProperties = async ({ q, page = 1, limit = 12 } = {}) => {
  const response = await api.get('/properties/search/bloom', {
    params: cleanParams({ q, page, limit }),
  });
  return response.data.data;
};

export const aiSearchProperties = async ({ query, city = 'Ahmedabad', limit = 12 } = {}) => {
  const response = await api.post('/properties/search/ai', { query, city, limit });
  return response.data.data;
};

export const getFeaturedProperties = async (limit = 3) => {
  const featured = await listProperties({ isFeatured: true, limit });
  if (featured.items?.length >= limit) {
    return featured;
  }

  const fallback = await listProperties({ sortBy: 'investment', limit });
  return {
    ...fallback,
    items: [...(featured.items || []), ...(fallback.items || [])]
      .filter((property, index, all) => all.findIndex((entry) => entry._id === property._id) === index)
      .slice(0, limit),
  };
};
