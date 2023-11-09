import {
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Navbar from "./components/navbar";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

const ProtectedRoute = () => {
  // const token = Cookies.get("access_token");

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default function App() {
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <Routes>
      <Route path="/login" element={<Dummy title={"Login"} />} />
      <Route path="*" element={<Dummy title={"Not Found"} />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dummy title={"Home"} />} />
        <Route path="/room" element={<Dummy title={"Room"} />} />
        <Route path="/maintenance" element={<Dummy title={"Maintenance"} />} />
        <Route path="/staff" element={<Dummy title={"Staff"} />} />
      </Route>
    </Routes>
  );
}

function Dummy({ title }: { title: string }) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {title}
    </div>
  );
}
