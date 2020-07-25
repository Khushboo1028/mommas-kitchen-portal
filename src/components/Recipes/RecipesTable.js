import React from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

const RecipesTable = (props) => {
	const { rows, columns, history } = props;

	return (
		<MaterialTable
			title=""
			columns={columns}
			data={rows}
			actions={[
				{
					icon    : EditIcon,
					tooltip : 'Edit Recipe',
					onClick : (event, rowData) => history.push(`/recipes/${rowData.doc_id}`)
				}
			]}
			options={{
				pageSizeOptions : [ 10, 50, 100, 200, 1000 ],
				search          : true
			}}
		/>
	);
};

export default withRouter(RecipesTable);
