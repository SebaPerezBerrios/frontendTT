import { useRoutes } from 'react-router-dom';
import routes from './router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { useAppDispatch, useAppSelector } from './appStore/hooks';
import { useEffect } from 'react';
import { getConfig, getMoreData, selectInit } from './appSlice/appSlice';

import { TaskTimer } from 'tasktimer';

const App = () => {
  const dispatch = useAppDispatch();
  const init = useAppSelector(selectInit);

  useEffect(() => {
    if (init) {
      dispatch(getConfig());
      const timer = new TaskTimer(1000);

      // Add multiple tasks (at once) based on tick intervals.
      timer.add([
        {
          id: 'getTweets', // unique ID of the task
          tickInterval: 120, // run every 5 ticks (5 x interval = 5000 ms)
          totalRuns: 0, // run 10 times only. (set to 0 for unlimited times)
          callback(_) {
            // code to be executed on each run
            dispatch(getMoreData());
          }
        }
      ]);

      // Start the timer
      timer.start();
    }
  });

  const content = useRoutes(routes);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default App;
