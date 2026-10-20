import { Suspense } from "react";
import { PermissionBoundary } from "@/components/permission-boundary";
export default function Layout({ children }: { children: React.ReactNode }) { return <Suspense fallback={null}><PermissionBoundary permission="analytics.view">{children}</PermissionBoundary></Suspense>; }
