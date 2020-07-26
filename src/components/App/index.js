import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AuthProvider } from '../Firebase/auth.js';
import PrivateRoute from '../Firebase/PrivateRoute.js';
import SignInPage from '../SignIn';
import RecipePage from '../Recipes';
import CategoryPage from '../Categories';
import RecipesDetails from '../Recipes/RecipeDetails';
import AddRecipe from '../Recipes/AddRecipe';
import CategoryDetails from '../Categories/CategoryDetails';
import AddCategories from '../Categories/AddCategories';
import * as ROUTES from '../../constants/routes';
import RecipesPage from '../Recipes';

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div>
					<Switch>
						<Route path={ROUTES.SIGN_IN} exact component={SignInPage} />
						<PrivateRoute path={ROUTES.HOME} exact component={RecipesPage} />
						<PrivateRoute path={ROUTES.RECIPES} exact component={RecipePage} />
						<PrivateRoute path={ROUTES.RECIPES_ADD} exact component={AddRecipe} />
						<PrivateRoute path={`${ROUTES.RECIPES}/:id`} exact component={RecipesDetails} />
						<PrivateRoute path={ROUTES.CATEGORIES} exact component={CategoryPage} />
						<PrivateRoute path={ROUTES.CATEGORIES_ADD} exact component={AddCategories} />
						<PrivateRoute path={`${ROUTES.CATEGORIES}/:id`} exact component={CategoryDetails} />
					</Switch>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
