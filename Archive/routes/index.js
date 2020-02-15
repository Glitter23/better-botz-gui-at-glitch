'use strict';

const path = './.data/secure-connect.zip';
const { Client } = require('cassandra-driver');
const client = new Client({
  cloud: { secureConnectBundle: path },
  credentials: { username: process.env.USERNAME, password: process.env.PASSWORD }
});

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Better Botz Nous, Welcome' + process.env.USERNAME });
});

router.get('/datareport', function (req, res) {
  getMoreData().then(function(data){
    res.render('datareport', { data } );
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

router.get('/data', function (req, res) {
  getMoreData().then(function(data){
    res.send(data);
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});



async function getClusterDetails() {
  let result = `Connected to ${client.hosts.length} nodes in the cluster: ${client.hosts.keys().join(', ')}`;
  return result;
}

async function getData() {
  const result = await client.execute('SELECT customer_name, address, description, price, prod_id, prod_name, sell_price FROM bb.orders');
  const row = result.first();
  console.log(row['customer_name']);
  return row;
}

async function getClusterName() {
  const result = await client.execute('select cluster_name from system.local');
  const row = result.first();
  return row;
}

async function getMoreData(){
  const result = await client.execute('SELECT customer_name, address, description, price, prod_id, prod_name, sell_price FROM bb.orders');
  return result.rows;
}

module.exports = router;