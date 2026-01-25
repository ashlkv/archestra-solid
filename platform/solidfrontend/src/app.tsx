import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Theme from '~/components/Theme';
import { ToastRegion } from "~/components/primitives/Toast";

export default function App() {
    return (
        <Theme>
            <ToastRegion />
            <Router
                root={(props) => (
                    <MetaProvider>
                        <Title>SolidStart - Basic</Title>
                        <Suspense>{props.children}</Suspense>
                    </MetaProvider>
                )}
            >
                <FileRoutes/>
            </Router>
        </Theme>
    );
}
