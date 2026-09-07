import { Link } from 'react-router-dom'
import notFoundImage from '../assets/PNF.png'

function PageNotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-black">
			<section className="w-full max-w-3xl text-center">
				<img
					src={notFoundImage}
					alt="Construction in progress illustration"
					className="mx-auto mb-2 h-auto w-full max-w-2xl"
				/>
				<p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-black">
					Error 404
				</p>
				<h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
					Page not found
				</h1>
				<p className="mx-auto mt-6 max-w-md text-base leading-7 text-black sm:text-lg">
					The page you are looking for does not exist or may have moved.
				</p>
				<Link
					to="/"
					className="mt-9 inline-flex rounded-full border border-black bg-black px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white">
					Back to home
				</Link>
			</section>
		</main>
	)
}

export default PageNotFound
