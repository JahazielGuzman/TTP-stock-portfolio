import Link from "next/link";

const Navbar = () => (
    <div>
        <ul>
            <li><Link href="/portfolio"><a>Portfolio</a></Link></li>
            <li><Link href="/transactions"><a>Transactions</a></Link></li>
        </ul>
    </div>
);

export default Navbar;