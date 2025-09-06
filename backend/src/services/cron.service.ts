
import prisma from '../prisma';

export const deleteOldSupportTickets = async () => {
  console.log('Running job: Deleting old support tickets...');
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  try {
    const result = await prisma.supportTicket.deleteMany({
      where: {
        status: 'Closed', // Only delete closed tickets
        lastUpdated: {
          lt: ninetyDaysAgo,
        },
      },
    });
    if (result.count > 0) {
        console.log(`Successfully deleted ${result.count} old, closed support tickets.`);
    }
  } catch (error) {
    console.error('Error running deleteOldSupportTickets job:', error);
  }
};

// This function starts all scheduled jobs for the application.
export const startCronJobs = () => {
    // Run the cleanup task every 24 hours.
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    setInterval(deleteOldSupportTickets, twentyFourHoursInMs);
    
    // Also run once on server startup for immediate cleanup.
    console.log('Initial cleanup job scheduled on startup.');
    setTimeout(deleteOldSupportTickets, 5000); // Delay slightly on startup
};
