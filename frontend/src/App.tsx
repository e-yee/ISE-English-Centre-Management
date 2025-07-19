// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AuthRoutes from './routes/AuthRoutes';
// import HomescreenPage from './pages/homescreen/HomescreenPage';
import ExamplePage from './pages/ExamplePage';
import ClassScreen from './pages/ClassScreen';
import ClassScreenTest from './pages/ClassScreenTest';
import HomescreenPage from './pages/homescreen/Homescreen';
import SidebarTestPage from './pages/SidebarTestPage';

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


{/* THIS IS FOR TESTING EACH PAGE INDIVIDUALLY */}

function App() {
  return (
    <div>
      {/* <HomescreenPage /> */}
      {/* <ClassScreen classId="CL001" /> */}
      {/* <SidebarTestPage /> */}
      <ExamplePage />
    </div>
  );
}

{/* THIS IS FOR TESTING EACH PAGE INDIVIDUALLY */}

export default App;
