const { fetchAll, fetchOne, execute } = require('../db');

async function listShifts() {
  return await fetchAll('SELECT * FROM shifts ORDER BY start_time ASC');
}

async function getShift(id) {
  return await fetchOne('SELECT * FROM shifts WHERE id = $1', [id]);
}

async function createShift(data) {
  const { shift_name, start_time, end_time, color, bg, icon, description, status } = data;
  const result = await execute(`
    INSERT INTO shifts (shift_name, start_time, end_time, color, bg, icon, description, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
  `, [shift_name, start_time, end_time, color || '#3b82f6', bg || '#eff6ff', icon || 'fas fa-clock', description || '', status || 'Active']);
  return result.lastrowid;
}

async function updateShift(id, data) {
  const { shift_name, start_time, end_time, color, bg, icon, description, status } = data;
  await execute(`
    UPDATE shifts SET shift_name = $1, start_time = $2, end_time = $3, color = $4, bg = $5, icon = $6, description = $7, status = $8
    WHERE id = $9
  `, [shift_name, start_time, end_time, color, bg, icon, description, status, id]);
}

async function deleteShift(id) {
  await execute('DELETE FROM shifts WHERE id = $1', [id]);
}

module.exports = {
  listShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift
};
