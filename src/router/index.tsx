import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { Template } from "../pages/template";
import { CameraPage } from "../pages/camera";
import PreviewPage from "../pages/previewPage";

const route: RouteObject[] = [
  {
    path: "/",
    element: <Template />,
  },
  {
    path: "/camera/:slug",
    element: <CameraPage />,
  },
  {
    path: "/preview/:slug",
    element: <PreviewPage />,
  },
];

export default function Router() {
  return <RouterProvider router={createBrowserRouter(route)} />;
}
