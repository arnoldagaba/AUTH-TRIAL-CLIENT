import { BrowserRouter, Route, Routes } from "react-router";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<div className="flex h-screen items-center-safe justify-center-safe text-2xl font-bold uppercase">
							Hello
						</div>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
