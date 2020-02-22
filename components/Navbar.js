import Link from "next/link";

const Navbar = () => (
    <nav className="level">
        <div className="level-left"></div>
        <div className="level-right">
            <div className="level-item"><Link href="/portfolio"><a>Portfolio</a></Link></div>
            <div className="level-item">|</div>
            <div className="level-item"><Link href="/transactions"><a>Transactions</a></Link></div>
        </div>
    </nav>
);

export default Navbar;