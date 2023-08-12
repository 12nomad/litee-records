import Stripe from "stripe";
import Record from "./components/Record";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const getRecords = async () => {
  const records = await stripe.products.list();

  const recordsWithPrice = await Promise.all(
    records.data.map(async (record) => {
      const recordPrices = await stripe.prices.list({
        product: record.id,
      });
      return {
        id: record.id,
        name: record.name,
        unit_amount: recordPrices.data[0].unit_amount,
        image: record.images[0],
        currency: recordPrices.data[0].currency,
        tracks: record.metadata?.tracks || "",
        description: record.description,
      };
    })
  );

  return recordsWithPrice;
};

const Home = async () => {
  const records = await getRecords();

  return (
    <main className="w-full flex flex-wrap justify-center md:justify-start gap-8">
      {records.map((record) => (
        <Record key={record.id} {...record} />
      ))}
    </main>
  );
};

export default Home;
