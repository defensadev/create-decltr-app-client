import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useRecoilValue } from "recoil";

import { devEventAtom } from "../state";
import { connSend, WSClient } from "../WSClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PointObj {
  x: number;
  y: number;
}

const StockChart = () => {
  const [priceData, setPriceData] = useState<null | Array<number>>(null);
  const [buyOrderData, setBuyOrderData] = useState<null | Array<PointObj>>(
    null
  );
  const [sellOrderData, setSellOrderData] = useState<null | Array<PointObj>>(
    null
  );
  const [xAxisData, setXAxisData] = useState<null | Array<number>>(null);

  const devEvent = useRecoilValue(devEventAtom);

  useEffect(() => {
    WSClient.addEventListener("message", (ev) => {
      const resp = JSON.parse(ev.data);
      if (!Array.isArray(resp)) {
        return;
      }
      if (!resp[0].price) {
        return;
      }

      console.log("Running!", resp[0].price);

      const priceArr = [];
      const buyArr = [];
      const sellArr = [];
      const xAxisArr = [];

      let openOrders: Array<number> = [];

      for (let i = 0; i < resp.length; i++) {
        const { price, App } = resp[i];
        const parsedPrice = parseFloat(price);

        xAxisArr.push(i);
        priceArr.push(parsedPrice);

        const closableOrder = openOrders.some((p) => parsedPrice >= p);
        if (closableOrder) {
          sellArr.push({ x: i, y: parsedPrice });
          openOrders = openOrders.filter((p) => parsedPrice < p);
        }

        if (App) {
          if (App.type === "buy") {
            buyArr.push({ x: i, y: parsedPrice });
            App.close && openOrders.push(parseFloat(App.close.price));
          } else {
            sellArr.push({ x: i, y: parsedPrice });
          }
        }
      }

      setPriceData(priceArr);
      setBuyOrderData(buyArr);
      setSellOrderData(sellArr);
      setXAxisData(xAxisArr);
    });
  }, []);

  useEffect(() => {
    if (devEvent) {
      connSend(JSON.stringify(devEvent)).catch(console.error);
    }
  }, [devEvent]);

  if (!devEvent) {
    return <p>Please Set A Dev Event</p>;
  }
  if (!priceData || !buyOrderData || !sellOrderData || !xAxisData) {
    return <p>Compiling App, Fetching Data...</p>;
  }

  return (
    <div className="h-full w-full max-w-4xl">
      <Chart
        type="scatter"
        data={{
          labels: xAxisData,
          datasets: [
            {
              type: "line",
              label: `Results - ${devEvent.pair}`,
              data: priceData,
              order: 0,
              borderColor: "rgb(37, 99, 235)",
              backgroundColor: "rgba(37, 99, 235, 0.5)",
              pointRadius: 0,
            },
            {
              type: "scatter",
              label: "Buy",
              order: 1,
              // @ts-ignore
              data: buyOrderData,
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.5)",
              pointRadius: 5,
            },
            {
              type: "scatter",
              label: "Sell",
              order: 2,
              // @ts-ignore
              data: sellOrderData,
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              pointRadius: 5,
            },
          ],
        }}
      />
    </div>
  );
};

export default StockChart;
