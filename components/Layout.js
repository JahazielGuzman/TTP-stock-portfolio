import Navbar from "./Navbar";
import Head from "next/head";

const Layout = (props) => (
    <div>
        <Head>
            <title>
                Stock Portfolio App
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" />
        </Head>
        <Navbar />
        {props.children}
    </div>
);

export default Layout;