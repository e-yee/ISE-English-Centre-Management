// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AuthRoutes from './routes/AuthRoutes';
import HomescreenPage from './pages/homescreen/HomescreenPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Auth routes */}
//         <Route path="/auth/*" element={<AuthRoutes />} />

//         {/* Home page route */}
//         <Route path="/home" element={<HomePageExample />} />

//         {/* Default route redirects to auth */}
//         <Route path="/" element={<Navigate to="/auth/login" replace />} />

//         {/* Catch all routes - redirect to auth for now */}
//         <Route path="*" element={<Navigate to="/auth/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


function App() {
  return (
    <div>
      <HomescreenPage /> 
    </div>
  );
}

export default App;
