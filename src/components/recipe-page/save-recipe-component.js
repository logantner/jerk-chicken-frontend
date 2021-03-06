import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestRecipebook, requestSaveRecipe } from '../../helpers/requests/recipe-requests';

async function getRecipe(setRecipe, id) {
	const res = await axios.get(`/recipes/${id}`);
	setRecipe(res.data);
}

function GetRecipe(props) {
	const [ currRecipe, setRecipe ] = useState({});
	const [ savedRecipes, setSavedRecipes ] = useState([]);
	const [ isSaved, setIsSaved ] = useState(true);

	useEffect(() => {
		(async (_) => {
			getRecipe(setRecipe, sessionStorage.getItem('selected-recipe'));
			let recipes = await requestRecipebook();
			const savedIds = recipes.map((obj) => obj.id);
			let saved = savedIds.includes(parseInt(sessionStorage.getItem('selected-recipe')));
			sessionStorage.setItem('isSaved', saved);
			setIsSaved(sessionStorage.getItem('isSaved'));
		})();
	}, []);

	function saveButton() {
		console.log(isSaved);
		if (isSaved != 'false') {
			return (
				<button className="btn btn-success" disabled>
					Favorite This Recipe
				</button>
			);
		}
		return (
			<button className="btn btn-success" onClick={handleSubmit}>
				Favorite This Recipe
			</button>
		);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		(async (_) => requestSaveRecipe(sessionStorage.getItem('selected-recipe')))();
		setIsSaved(true);
	};

	if (currRecipe.name)
		return (
			<div className="container">
				<div style={{ marginTop: 20 }}>
					<div className="card">
						<div className="card-header">
							<h3>{currRecipe.name}</h3>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-6">
									<strong>Prep Time:</strong>
									<br /> {currRecipe.prepTime} min
									<hr className="style3" />
								</div>
								<div className="col-6">
									<strong>Cook Time:</strong>
									<br />
									{currRecipe.cookTime} min
									<hr className="style3" />
								</div>
							</div>
							<div className="row">
								<div className="col-6">
									<h5>Ingredients</h5>
									<ul>
										{currRecipe.ingredients.map((i) => {
											return (
												<li key={i.ingredient_id}>
													{i.qty} {i.unit.longType} {i.name}
												</li>
											);
										})}
									</ul>
								</div>
								<div className="col-6">
									<h5>Instructions</h5>
									<ol>
										{currRecipe.steps.map((s) => {
											return <li key={s.step_id}>{s.instruction}</li>;
										})}
									</ol>
								</div>
							</div>
						</div>
						<div className="row card-footer justify-content-between">
							{/* <button className="btn btn-success" onClick={props.onSubmit} >
                  Save Recipe
                </button> */}
							{saveButton()}
							<Link className="btn btn-danger" to="/" role="button">
								Return to Basket
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	else return <div />;
}

function mapStateToProps(store) {
	return {
		currentRecipe: store.currentRecipe,
		recipes: store.recipeBook
	};
}

export default connect(mapStateToProps)(GetRecipe);
