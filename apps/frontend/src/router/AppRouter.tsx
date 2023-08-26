import { Route, Routes } from 'react-router-dom';
import HearMeOutRoutes from '../hearMeOut/routes/HearMeOutRoutes';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<HearMeOutRoutes />} />
    </Routes>
  );
};
