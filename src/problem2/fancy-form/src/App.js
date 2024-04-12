import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { Select } from './components/Select';
import { naiveRound } from './utils/helper';

function App() {
  // Initializing all the state variables 
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("USD");
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState("");

  // Convert the currency
  const convert = useCallback(() => {
      const fromPrice = data.find(i => i.currency === from)?.price;
      const toPrice = data.find(i => i.currency === to)?.price;
      const output = amount * fromPrice / toPrice;
      setResult(amount + " " + from + " ≈ " + naiveRound(output, 9) + " " + to);
  }, [data, amount, from, to])

  // Calling the api
  useEffect(() => {
      Axios.get(
  `https://interview.switcheo.com/prices.json`)
          .then((res) => {
            setData(res.data);
            setIsFetching(false);
          })
          .catch((error) => {
            console.log(error.response.data)
          });
  }, []);

  const tokenIconsSrc = (name) => {
    return 'https://raw.githubusercontent.com/Switcheo/' +
    `token-icons/main/tokens/${name}.svg`
  }

  // After data fetched
  useEffect(() => {
      const uniqueData = data.reduce((arr, cur) => {
        return (arr.find(i => i.currency === cur.currency)) ?
          arr : [...arr, cur]
      }, [])
      setOptions(uniqueData.map(i => ({value: i.currency,
                                label: i.currency,
                                icon: tokenIconsSrc(i.currency)})));
      setFrom(uniqueData[0]?.currency);
  }, [data])

  // First loaded
  useEffect(() => {
      if (from && !result) convert();
  }, [from, result, convert]);

  if (isFetching) return (
    <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h3>Fetching data...</h3>
      </header>
    </div>
  );

  if (!options.length) return (
    <div className="App">
          <h3>No data found!</h3>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Currency converter</h3>
      </header>
      <div className="App-body">
        <div className="container">
          <div className="left">
              <h3>Amount</h3>
              <input type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  style={{height: 38}}
                  />
          </div>
          <div className="middle">
              <h3>From</h3>
              <Select
                name="from"
                options={options}
                onChange={(selected) => { setFrom(selected.value) }}
                defaultValue={options[0]}
                />
          </div>
          <div className="right">
              <h3>To</h3>
              <Select
                name="to"
                options={options}
                onChange={(selected) => { setTo(selected.value) }}
                defaultValue={options.find(i => i.value === 'USD')}
                />
          </div>
        </div>
        <div className='action'>
            <button onClick={convert}>Convert</button>
        </div>
        <div className="result">
            <h3>Converted Amount:</h3>
            <h2>{result}</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
