import { MONGODB_DATA_API_URL, MONGODB_API_KEY, DATABASE_NAME, CLUSTER_NAME } from '../config';

const mongoRequest = async (action, collection, document = {}, filter = {}) => {
  const response = await fetch(`${MONGODB_DATA_API_URL}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MONGODB_API_KEY
    },
    body: JSON.stringify({
      collection,
      database: DATABASE_NAME,
      dataSource: CLUSTER_NAME,
      ...document && { document },
      ...filter && { filter }
    })
  });
  return response.json();
};

export const mongoAPI = {
  insertOne: (collection, document) => mongoRequest('insertOne', collection, document),
  findOne: (collection, filter) => mongoRequest('findOne', collection, {}, filter),
  find: (collection, filter = {}) => mongoRequest('find', collection, {}, filter),
  updateOne: (collection, filter, update) => mongoRequest('updateOne', collection, { update }, filter),
  deleteOne: (collection, filter) => mongoRequest('deleteOne', collection, {}, filter)
};