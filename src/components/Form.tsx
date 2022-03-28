import { useEffect, useState } from "react";

import { useSetRecoilState } from "recoil";

import useSWR from "swr";

import { devEventAtom } from "../state";

const getAssetPairs = (assetPairs: string[], pair: string) => {
  const res = [];
  for (let i = 0; i < assetPairs.length; i++) {
    if (res.length >= 5) {
      return res;
    }
    if (assetPairs[i].includes(pair)) {
      res.push(assetPairs[i]);
    }
  }

  return res;
};

const Form = () => {
  const [pair, setPair] = useState({ pair: "", selected: false });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [profit, setProfit] = useState("0.1");
  const [volume, setVolume] = useState("1");
  const [payload, setPayload] = useState({
    pair: "",
    startTime: NaN,
    endTime: NaN,
    profit: "",
    volume: "",
    init: true,
  });
  const [err, setErr] = useState("");
  const setDevEvent = useSetRecoilState(devEventAtom);

  const { data, error } = useSWR<string[]>(
    "http://localhost:3000/api/AssetPairs"
  );

  useEffect(() => {
    if (payload.init) {
      return;
    }

    if (!data?.includes(payload.pair)) {
      setErr("invalid pair. please pick one from the list");
      return;
    }
    if (isNaN(payload.startTime)) {
      setErr("invalid Start Time. please select a valid date");
      return;
    }
    if (isNaN(payload.endTime)) {
      setErr("invalid End Time. please select a valid date");
      return;
    }
    if (payload.startTime > payload.endTime) {
      setErr(
        "invalid Start & End Time combo. please put End Time after Start Time"
      );
      return;
    }
    if (isNaN(parseFloat(payload.profit))) {
      setErr("invalid profit. please type a valid float");
      return;
    }
    if (isNaN(parseFloat(payload.volume))) {
      setErr("invalid volume. please type a valid float");
      return;
    }
    setErr("");

    const st = new Date(payload.startTime);
    st.setHours(0, 0, 0, 0);
    const et = new Date(payload.endTime);
    et.setHours(23, 59, 59, 999);
    const parsedPayload = {
      ...payload,
      startTime: st.getTime(),
      endTime: et.getTime(),
    };
    setDevEvent(parsedPayload);
  }, [payload, data, setDevEvent]);

  if (error) {
    console.error(error);
    return (
      <div className="flex flex-col m-4">
        <h1 className="text-gray-700 text-4xl">A Server Error Occurred.</h1>
        <p>
          Specifically the rest api @
          <span className="text-gray-700 font-extrabold"> /api/AssetPairs</span>
        </p>
        <p className="text-red-400">Reason: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const assetPairs = getAssetPairs(data, pair.pair);

  return (
    <div className="flex flex-col m-4">
      <div className="flex justify-center mx-4 my-2 w-48">
        <button
          onClick={() =>
            setPayload({
              pair: pair.pair,
              startTime: startTime.getTime(),
              endTime: endTime.getTime(),
              profit: profit,
              volume: volume,
              init: false,
            })
          }
          className="bg-indigo-600 text-white text-2xl rounded w-48 py-1"
        >
          Start
        </button>
      </div>
      <div className="flex flex-col w-48 mx-4 my-2">
        {err && <p className="text-red-500">{err}</p>}
        <label htmlFor="startTime" className="font-extrabold text-gray-700">
          Start Time
        </label>
        <input
          value={startTime.toISOString().split("T")[0]}
          onChange={(e) => setStartTime(new Date(e.target.value))}
          type="date"
          name="startTime"
          id="startTime"
          className="px-2 py-1 rounded border-2 focus:border-indigo-600 active:border-indigo-600 transition-colors outline-none"
        />
      </div>
      <div className="flex flex-col w-48  mx-4 my-2">
        <label htmlFor="endTime" className="font-extrabold text-gray-700">
          End Time
        </label>
        <input
          value={endTime.toISOString().split("T")[0]}
          onChange={(e) => setEndTime(new Date(e.target.value))}
          type="date"
          name="endTime"
          id="endTime"
          className="px-2 py-1 rounded border-2 focus:border-indigo-600 active:border-indigo-600 transition-colors outline-none"
        />
      </div>
      <div className="flex flex-col w-48  mx-4 my-2">
        <label htmlFor="profit" className="font-extrabold text-gray-700">
          Profit Per Trade
        </label>
        <input
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          name="profit"
          id="profit"
          className="px-2 py-1 rounded border-2 focus:border-indigo-600 active:border-indigo-600 transition-colors outline-none"
        />
      </div>
      <div className="flex flex-col w-48  mx-4 my-2">
        <label htmlFor="volume" className="font-extrabold text-gray-700">
          Volume Per Trade
        </label>
        <input
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          name="volume"
          id="volume"
          className="px-2 py-1 rounded border-2 focus:border-indigo-600 active:border-indigo-600 transition-colors outline-none"
        />
      </div>

      <div className="flex flex-col w-48  mx-4 my-2">
        <label htmlFor="pair" className="font-extrabold text-gray-700">
          Pair
        </label>
        <input
          value={pair.pair}
          onChange={(e) =>
            setPair({ pair: e.target.value.toUpperCase(), selected: false })
          }
          name="pair"
          id="pair"
          autoComplete="off"
          className="px-2 py-1 rounded border-2 focus:border-indigo-600 active:border-indigo-600 transition-colors outline-none"
        />
        {pair.pair.length > 0 && !pair.selected && (
          <div className="bg-slate-50 rounded">
            {assetPairs.map((assetPair) => (
              <p
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200"
                key={assetPair}
                onClick={() => setPair({ pair: assetPair, selected: true })}
              >
                {assetPair}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
