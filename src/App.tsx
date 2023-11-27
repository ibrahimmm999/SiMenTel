import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login/page";
import Cookies from "js-cookie";
import DaftarUser from "./pages/daftarUser/page";
import ListRoom from "./pages/listRoom/page";
import DetailRoom from "./pages/detailRoom/page";
import EditRoom from "./pages/editRoom/page";
import MaintenancePage from "./pages/maintenance/page";
import AddRoom from "./pages/addRoom/page";
import Dashboard from "./pages/dashboard/page";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

const ProtectedRoute = () => {
  const token = Cookies.get("token_simentel");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Dummy title={"Not Found"} />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/room">
          <Route path="" element={<ListRoom />} />
          <Route path="add" element={<AddRoom />} />
          <Route path="detail/:idx">
            <Route path="" element={<DetailRoom />} />
            <Route path="edit" element={<EditRoom />} />
          </Route>
        </Route>
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/staff" element={<DaftarUser />} />
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
