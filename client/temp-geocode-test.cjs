/* global require, process */

const fs = require('fs');
const fetch = require('node-fetch');

const env = fs
  .readFileSync('.env', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [k, v] = line.split('=');
    acc[k] = v;
    return acc;
  }, {});

const key = env.VITE_GOOGLE_MAPS_API_KEY;
if (!key) {
  console.error('No API key found');
  process.exit(1);
}

const query = 'Pune, India';
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  query
)}&key=${key}`;

console.log('Querying:', url);

fetch(url)
  .then((r) => r.json())
  .then((data) => {
    console.log('status', data.status);
    console.log('result', data.results?.[0]?.formatted_address);
    console.log('location', data.results?.[0]?.geometry?.location);
  })
  .catch((e) => {
    console.error('fetch error', e);
  });
