import Link from "next/link";

const Navbar = () => (
    <div>
        <ul>
            <li><Link href="/Portfolio"><a>Portfolio</a></Link></li>
            <li><Link href="/Transactions"><a>Transactions</a></Link></li>
        </ul>
    </div>
);

export default Navbar;