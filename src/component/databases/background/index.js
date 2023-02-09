import BackgroundJob from 'react-native-background-job';
export const backgroundProcess = (jobKey, timeout) => {
  const backgroundJob = {
    jobKey: jobKey,
    job: () => console.log('Running in background'),
  };

  BackgroundJob.register(backgroundJob);

  var backgroundSchedule = {
    jobKey: jobKey,
    timeout: timeout,
  };

  BackgroundJob.schedule(backgroundSchedule)
    .then(() => console.log('Success'))
    .catch(err => console.err(err));
};
