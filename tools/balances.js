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

const updateBalanceRow = ({id,action,amount,interest_rate,created_at}) => {
	return dbQuery.findOne('balances', { where: { id: id } })
	.then((balance) => balance.update(
		{action,amount,interest_rate,created_at},
		{ fields: ['action','amount','interest_rate','created_at'] })
	);
};

const deleteBalanceRow = (id) => {
	return getModel('balances').destroy({ id });
};

const getBalancesByUserId = (userId) => {
	return dbQuery.findAndCountAllWithRows('balances', {
		where: {
			user_id: userId,
		},
		attributes: {
			exclude: ['user_id', 'updated_at']
		},
		order: [['created_at', 'DESC'], ['id', 'ASC']],
	}).then(({ count, data }) => {count, data});
};


module.exports = {
	createBalanceRow,
	updateBalanceRow,
	deleteBalanceRow,
	getBalancesByUserId
};