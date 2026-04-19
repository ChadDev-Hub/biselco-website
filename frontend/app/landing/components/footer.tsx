
"use client"




const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content rounded-t-3xl">
            <aside>
                <div className="text-2xl font-black mb-4">BUSUANGA <span className="text-primary">ISLAND</span></div>
                <p>Electric Cooperative Inc.<br />Providing reliable power since 1979</p>
            </aside>
            <nav>
                <h6 className="footer-title opacity-50">Contact Us</h6>
                <div>
                    <h4 className="text-blue-600"><span>📞</span> Serbisyo Hotline <span className="text-primary">24/7</span> </h4>
                    <ul className="">
                        <li>09176511859</li>
                        <li>09176396436</li>
                    </ul>
                </div>

                <p>biselco79@yahoo.com</p>

            </nav>
            <nav>
                <h6 className="footer-title opacity-50">Member Services</h6>
                <a className="link link-hover">Energy Saving Tips</a>
            </nav>
            <nav>
                <h6 className="footer-title opacity-50">Transparency</h6>
                <a className="link link-hover">Board Resolutions</a>
                <a className="link link-hover">Financial Reports</a>
                <a className="link link-hover">Careers</a>
            </nav>
        </footer>
    )
}

export default Footer