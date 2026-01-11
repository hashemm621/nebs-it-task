import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import ErrorPage from "../pages/errorPage/errorpage";
import Notices from "../pages/errorPage/Notices/Notices";
import PlaceholderPage from "../componets/PlaceholderPage";
import NoticeBoard from "../pages/addNotice/NoticeBoard";

const router = createBrowserRouter([
    {
        path:'/',
        Component:RootLayout,
        errorElement:<ErrorPage/>,
    children:[
        {index:true,Component:Notices},
        {
            path:'dashboard',
            Component:Notices
        },
        {
            path:'employee',
            children:[
                {
                    path:'database',
                    element:<PlaceholderPage title={'Employee database is Coming soon...'}/>
                },
                {
                    path:'add-new-employee',
                    element:<PlaceholderPage title={'Add New Employee is Coming soon...'}/>
                },
                {
                    path:'performance-report',
                    element:<PlaceholderPage title={'Employee performance report is Coming soon...'}/>
                },
                {
                    path:'performance-history',
                    element:<PlaceholderPage title={'Employee performance history is Coming soon...'}/>
                },
            ]
        },
        {
            path:'payroll',
            element:<PlaceholderPage title={'Payroll is Coming soon...'}/>
        },
        {
            path:'pay-slip',
            element:<PlaceholderPage title={'Pay Slip is Coming soon...'}/>
        },
        {
            path:'attendance',
            element:<PlaceholderPage title={'Attendance is Coming soon...'}/>
        },
        {
            path:'request-center',
            element:<PlaceholderPage title={'Request Center is Coming soon...'}/>
        },
        {
            path:'career',
            element:<PlaceholderPage title={'Career is Coming soon...'}/>
        },
        {
            path:'docs',
            element:<PlaceholderPage title={'Docs is Coming soon...'}/>
        },
        {
            path:'notice-board',
            element:<NoticeBoard/>
        },
        {
            path:'employee',
            element:<PlaceholderPage title={'Employee is Coming soon...'}/>
        },
        {
            path:'activity',
            element:<PlaceholderPage title={'Activity is Coming soon...'}/>
        },
        {
            path:'exit',
            element:<PlaceholderPage title={'Exit Interview is Coming soon...'}/>
        },
        {
            path:'profile',
            element:<PlaceholderPage title={'Profile is Coming soon...'}/>
        },
    ]  }
])
export default router;