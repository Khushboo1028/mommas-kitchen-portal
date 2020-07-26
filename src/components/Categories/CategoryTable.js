import React from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';

const CategoryTable = (props) => {
	const { rows, columns, history } = props;

	return (
		<MaterialTable
			title=""
			columns={columns}
			data={rows}
			actions={[
				{
					icon    : 'edit',
					tooltip : 'Edit Category',
					onClick : (event, rowData) => history.push(`/categories/${rowData.doc_id}`)
				}
			]}
			options={{
				pageSizeOptions : [ 10, 50, 100, 200, 1000 ]
			}}
		/>
	);
};

export default withRouter(CategoryTable);
