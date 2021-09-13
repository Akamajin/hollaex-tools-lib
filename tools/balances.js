'use strict';

const { getModel } = require('./database/model');
const dbQuery = require('./database/query');

const createBalanceRow = ({user_id,action,amount,interest_rate,created_at}) => {
	return getModel('balances').create({
		user_id,
		created_at,
		interest_rate,
		action,
		amount
	});
};

const bulkCreateBalanceRow = (data) => {
	return getModel('balances').bulkCreate(data);
};

const updateBalanceRow = ({id,action,amount,interest_rate,created_at}) => {
	return dbQuery.findOne('balances', { where: { id: id } })
	.then((balance) => balance.update(
		{action,amount,interest_rate,created_at},
		{ fields: ['action','amount','interest_rate','created_at'] })
	);
};

const deleteBalanceRow = (id) => {
	return getModel('balances').destroy({where: {id}});
	//return getModel('balances').destroy({ id });
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

const getUsersAllDeposits = () => {
  	return dbQuery.findAll('balances', {raw: true}).then(res => res);
}

module.exports = {
	createBalanceRow,
	updateBalanceRow,
	deleteBalanceRow,
	getBalancesByUserId,
	bulkCreateBalanceRow,
	getUsersAllDeposits
};