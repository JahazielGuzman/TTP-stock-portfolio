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
        <section className="section">
            <div className="container">
                <Navbar />
                {props.children}
            </div>
        </section>
        <style jsx>{`
            font-family: "Comic Sans MS", cursive, sans-serif;
        `}</style>
    </div>
);

export default Layout;