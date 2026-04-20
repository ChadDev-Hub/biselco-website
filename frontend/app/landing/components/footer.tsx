
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
                {/* PHONE */}
                <div>
                    <h4 className="text-blue-600"><span>📞</span> Serbisyo Hotline <span className="text-yellow-300">24/7</span> </h4>
                    <ul role="list" className="list-disc list-inside">
                        <li className="list-item indent-5">09176511859</li>
                        <li className="list-item indent-5">09176396436</li>
                        <li className="list-item indent-5">09107101909</li>
                    </ul>
                </div>
                {/* EMAIL */}
                <div>
                    <h6>
                        <span>📧</span> Email
                    </h6>
                    <ul className="list-disc list-inside">
                        <li className="list-item indent-5">
                            biselco79@yahoo.com
                        </li>
                    </ul>
                </div>
                {/* SOCIAL MEDIA */}
                <div>
                    <h6><span>📸</span>Social Media</h6>
                    <ul className="list-disc list-inside">
                        <li className="list-item indent-5"><a className="link link-hover" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/biselco.coronpalawan/"><span>ⓕ</span> BISELCO EC</a></li>
                    </ul>
                </div>


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