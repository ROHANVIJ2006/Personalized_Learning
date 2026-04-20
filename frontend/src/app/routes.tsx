import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { SkillAssessment } from "./pages/SkillAssessment";
import { SkillProgress } from "./pages/SkillProgress";
import { CourseRecommendations } from "./pages/CourseRecommendations";
import { LearningPath } from "./pages/LearningPath";
import { GovtCourses } from "./pages/GovtCourses";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { 
        path: "assessment", 
        Component: SkillAssessment
      },
      { 
        path: "progress", 
        Component: SkillProgress
      },
      { 
        path: "recommendations", 
        Component: CourseRecommendations
      },
      { 
        path: "learning-path", 
        Component: LearningPath
      },
      { 
        path: "govt-courses", 
        Component: GovtCourses
      },
      { 
        path: "profile", 
        Component: Profile
      },
      { 
        path: "settings", 
        Component: Settings
      },
    ],
  },
  {
    path: "/edit-profile",
    Component: RootLayout,
    children: [
      { 
        index: true, 
        Component: Settings
      },
    ],
  },
]);
