import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { HOSTAL } from "@/modules/shared/data/hostal";
import logo from "@/assets/logo.png";
import SocialLinks from "./SocialLinks";

const links = [
	{ to: "/", label: "Inicio" },
	{ to: "/habitaciones", label: "Habitaciones" },
	{ to: "/servicios", label: "Servicios" },
	{ to: "/reservas", label: "Reservas" },
	{ to: "/resenas", label: "Reseñas" },
	{ to: "/lugares-interes", label: "Lugares de Interés" }, // added
];

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const location = useLocation();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
		<nav className="container mx-auto flex items-center justify-between h-16 px-4">
			{/* Mobile logo */}
			<Link to="/" className="desk:hidden">
				<img src={logo} alt={HOSTAL.name} className="h-10 w-auto" />
			</Link>

			{/* Desktop */}
				<ul className="hidden desk:flex justify-center items-center w-1/2 gap-8">
					{links.map((l) => (
						<li key={l.to}>
							<Link
								to={l.to}
								className={`text-sm font-medium transition-colors hover:text-primary ${
									location.pathname === l.to ? "text-primary" : "text-foreground"
								}`}
							>
								{l.label}
							</Link>
						</li>
					))}
				</ul>

				<div className={'flex justify-between gap-2'}>
					<Link to="/reservas" className="hidden desk:block">
					<Button className="font-semibold">Reservar Ahora</Button>
				</Link>
				<div className="hidden desk:flex items-center ml-4">
					<SocialLinks
						facebookUrl="https://www.facebook.com/people/Hostal-Villa-D2/61557501643727/"
						twitterUrl="https://x.com/villad2"
						youtubeUrl="https://youtube.com/villad2"
						whatsappUrl="https://wa.me/1234567890"
					/>
				</div>
				</div>

				{/* Mobile toggle */}
				<button className="desk:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
					{open ? <X size={24} /> : <Menu size={24} />}
				</button>
			</nav>

			{/* Mobile menu */}
			{open && (
				<div className="desk:hidden bg-background border-b border-border px-4 pb-4">
					<ul className="flex flex-col gap-3">
						{links.map((l) => (
							<li key={l.to}>
								<Link
									to={l.to}
									onClick={() => setOpen(false)}
									className={`block py-2 text-sm font-medium ${
										location.pathname === l.to ? "text-primary" : "text-foreground"
									}`}
								>
									{l.label}
								</Link>
							</li>
						))}
						<li>
							<Link to="/reservas" onClick={() => setOpen(false)}>
								<Button className="w-full font-semibold">Reservar Ahora</Button>
							</Link>
						</li>
					</ul>
				</div>
			)}
		</header>
	);
}
