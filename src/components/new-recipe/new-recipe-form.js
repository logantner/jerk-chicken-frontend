import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import NameInput from './inputs/name-input';
import PrepTimeInput from './inputs/prep-time-input';
import CookTimeInput from './inputs/cook-time-input';
import IngredientsInput from './inputs/ingredients-input';
import InstructionsInput from './inputs/instructions-input';
import { requestAddNewRecipe } from '../../helpers/requests/recipe-requests';

// import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const NewRecipe = (props) => {
	const [ ingredientList, setIngredientList ] = useState([
		{
			index: Math.random(),
			quantity: '',
			unit: '',
			category: '',
			ingredient: '',
			description: ''
		}
	]);
	const [ instructionList, setInstructionList ] = useState([ { index: Math.random(), instruction: '' } ]);
	const [ name, setName ] = useState('');
	const [ prepTime, setPrepTime ] = useState('');
	const [ cookTime, setCookTime ] = useState('');
	const [ newRecipe, setNewRecipe ] = useState({});

	const handleChange = (e) => {
		//console.log(ingredientList);
		if ([ 'quantity', 'unit', 'category', 'ingredient', 'description' ].includes(e.target.name)) {
			let temp = [ ...ingredientList ];
			temp[e.target.dataset.id][e.target.name] = e.target.value;
			if (e.target.dbid) {
				temp[e.target.dataset.id][`${e.target.name}_id`] = e.target.dbId;
			}
			setIngredientList(temp);
		} else if (e.target.name === 'instruction') {
			let temp = [ ...instructionList ];
			temp[e.target.dataset.id][e.target.name] = e.target.value;
			setInstructionList(temp);
		} else if (e.target.name === 'recipe-name') {
			setName(e.target.value);
		} else if (e.target.name === 'prepTime') {
			setPrepTime(e.target.value);
		} else if (e.target.name === 'cookTime') {
			setCookTime(e.target.value);
		}
	};

	const addNewIngredientRow = (e) => {
		//console.log(ingredientList);
		setIngredientList([
			...ingredientList,
			{ index: Math.random(), quantity: '', unit: '', category: '', ingredient: '', description: '' }
		]);
	};

	const addNewInstructionRow = (e) => {
		setInstructionList([ ...instructionList, { index: Math.random(), instruction: '' } ]);
	};

	const deleteIngredientRow = (record) => {
		setIngredientList(ingredientList.filter((r) => r !== record));
	};

	const deleteInstructionRow = (record) => {
		setInstructionList(instructionList.filter((r) => r !== record));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validated()) {
			return;
		}
		// This sets the recipe, which triggers a hook that (eventually) reroutes the page
		setNewRecipe(buildRecipe());
	};

	useEffect(() => {
		if (newRecipe && newRecipe.name) {
			requestAddNewRecipe(newRecipe).then(() => {
				props.history.push('/user');
			});
		}
	}, [newRecipe, props.history]);

	function validated() {
		if (name === '' || prepTime === '' || cookTime === '') {
			NotificationManager.warning('Please input required top-level fields');
			return false;
		}

		if (ingredientList.length === 0 || instructionList.length === 0) {
			NotificationManager.warning('A recipe must include at least one ingredient and instructional step');
			return false;
		}

		for (var i = 0; i < ingredientList.length; i++) {
			if (
				ingredientList[i].quantity === '' ||
				ingredientList[i].unit === '' ||
				(ingredientList[i].ingredient === '' && ingredientList[i].description === '')
			) {
				NotificationManager.warning(
					`Please include a quantity, unit, and either ingredient name or description for each ingredient row`
				);
				return false;
			}
		}

		for (var j = 0; j < instructionList.length; j++) {
			if (instructionList[j].instruction === '') {
				NotificationManager.warning('Instruction fields may nto be empty');
				return false;
			}
		}

		return true;
	}

	const buildRecipe = () => {
		const steps = instructionList.map((val, idx) => {
			return { position: idx + 1, instruction: val.instruction };
		});
		const ingredients = ingredientList.map((ingr) => {
			return {
				qty: ingr.quantity,
				unit: { id: ingr.unit },
				ingredient_id: ingr.ingredient,
				ingredientDescription: ingr.description ? ingr.description : null,
				category: { id: ingr.category.split('_')[1] }
			};
		});
		return {
			name: name,
			prepTime: prepTime,
			cookTime: cookTime,
			steps: steps,
			ingredients: ingredients
		};
	};

	return (
		<div className="content container-fluid">
			<form onSubmit={handleSubmit} onChange={handleChange}>
				<div className="row" style={{ marginTop: 20 }}>
					<div className="col-sm-1" />
					<div className="col-sm-10">
						<div className="card">
							<div className="card-header text-center">Add a New Recipe</div>
							<div className="card-body">
								<div className="row">
									<div className="col-4">
										<NameInput />
									</div>
									<div className="col-2">
										<PrepTimeInput />
									</div>
									<div className="col-2">
										<CookTimeInput />
									</div>
								</div>
								<IngredientsInput
									addNewIngredientRow={addNewIngredientRow}
									deleteIngredientRow={deleteIngredientRow}
									ingredientList={ingredientList}
								/>
								<InstructionsInput
									addNewInstructionRow={addNewInstructionRow}
									deleteInstructionRow={deleteInstructionRow}
									instructionList={instructionList}
								/>
							</div>
							<div className="row card-footer justify-content-between">
								<button type="submit" className="btn btn-primary text-center">
									Submit
								</button>
								<NotificationContainer />
								<a className="btn btn-danger" href="/user" role="button">
									Cancel
								</a>
							</div>
						</div>
					</div>
					<div className="col-sm-1" />
				</div>
			</form>
		</div>
	);
};

export default withRouter(NewRecipe);
