'use strict';

const { getModel } = require('./database/model');
const dbQuery = require('./database/query');

const createBalanceRow = ({user_id,action,amount,interest_rate,deduction_rate,created_at,group,end_date,meta}) => {
	return getModel('balances').create({
		user_id,
		created_at,
		interest_rate,
		deduction_rate,
		action,
		amount,
		group,
		end_date,
		meta
	});
};

const bulkCreateBalanceRow = (data) => {
	return getModel('balances').bulkCreate(data);
};

const updateBalanceRow = ({id,action}) => {
	return dbQuery.findOne('balances', { where: { id: id } })
	.then((balance) => balance.update(
		{action},
		{ fields: ['action'] })
	);
};

const deleteBalanceRow = (id) => {
	return getModel('balances').destroy({where: {id}});
	//return getModel('balances').destroy({ id });
};

const deleteRequestRow = ({user_id, id}) => {
	return getModel('balances').destroy({where: {
		id,
		user_id,
		$or: [
			{
				action: 
				{
					$eq: "Withdraw (Pending)"
				}
			}, 
			{
				action: 
				{
					$eq: "Withdraw Investment (Pending)"
				}
			}
		]
	}});
};

const getBalancesByUserId = (userId) => {
	return dbQuery.findAndCountAllWithRows('balances', {
		where: { user_id: userId },
		attributes: { exclude: ['user_id', 'updated_at'] },
		order: [['created_at', 'DESC'], ['id', 'ASC']],
	}).then((res) => {
		const { count, data } = res;
		return {count, data};
	});
};

const geAllDeposits = () => {
  	return dbQuery.findAll('balances', {
		  raw: true,
		  order: [['created_at', 'DESC']],
		}).then(res => res);
}

const getUsersInvestmentsAndEmails = () => {
	return dbQuery.findAndCountAllWithRows('balances', {
		where: {$or: [{action: "Capital Increase"}, {action: "Withdraw Investment"}, {action: "Capital Investment (Fixed)"}, {action: "Capital Investment (Decreasing)"}]},
		include: [{
			model: getModel('user'),
			as: 'user',
			required: true,
			attributes: ['email']
		}],
		attributes: ['action', 'amount'],
	}).then(res => res);
}

module.exports = {
	createBalanceRow,
	updateBalanceRow,
	deleteBalanceRow,
	deleteRequestRow,
	getBalancesByUserId,
	bulkCreateBalanceRow,
	geAllDeposits,
	getUsersInvestmentsAndEmails
};