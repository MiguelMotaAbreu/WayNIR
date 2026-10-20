import { Suspense } from "react";
import { PermissionBoundary } from "@/components/permission-boundary";
export default function Layout({ children }: { children: React.ReactNode }) { return <Suspense fallback={null}><PermissionBoundary permission="dashboard.view">{children}</PermissionBoundary></Suspense>; }
