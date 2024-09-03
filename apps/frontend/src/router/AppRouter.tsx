import { Route, Routes } from 'react-router-dom';
import HearMeOutRoutes from '@hearmeout/routes/HearMeOutRoutes';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<HearMeOutRoutes />} />
    </Routes>
  );
};
