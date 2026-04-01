import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { FixedLayout } from "~/primitives/FixedLayout";
import { ToastRegion } from "~/primitives/Toast";
import Theme from "~/Theme";

export default function App() {
    return (
        <Theme>
            <ToastRegion />
            <Router
                root={(props) => (
                    <MetaProvider>
                        <Title>SolidStart - Basic</Title>
                        <FixedLayout>
                            <Suspense>{props.children}</Suspense>
                        </FixedLayout>
                    </MetaProvider>
                )}
            >
                <FileRoutes />
            </Router>
        </Theme>
    );
}
