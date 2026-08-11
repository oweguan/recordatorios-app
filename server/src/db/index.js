const impl = process.env.DATABASE_URL
  ? await import('./postgres.js')
  : await import('./sqlite.js');

export const {
  init,
  createReminder,
  getReminderById,
  listReminders,
  getDueReminders,
  markSent,
  rescheduleRecurring,
  setReminderStatus,
  updateReminder,
  reorderReminders,
  deleteReminder,
  savePushSubscription,
  listPushSubscriptions,
  deletePushSubscription,
  saveGoogleAuth,
  getGoogleAuth,
  setGoogleFeatureEnabled,
  updateReminderGoogleEventId,
  listProjects,
  getProjectById,
  findOrCreateProjectByName,
  createProject,
  updateProject,
  deleteProject,
  createSubtask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
} = impl;
