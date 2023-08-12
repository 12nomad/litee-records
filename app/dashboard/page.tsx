import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

import { IUser, IExtendedUser } from "../../interfaces/IUser.interface";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { BsDisc } from "react-icons/bs";
import moment from "moment";

export const revalidate = 0;

const prisma = new PrismaClient();

type IAuthUser = (IUser & IExtendedUser) | undefined;

const getOrders = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return "Unauthenticated";

  const authUser: IAuthUser = session.user;

  const orders = await prisma.order.findMany({
    where: { userId: authUser.id, status: "success" },
    include: { records: true },
  });
  return orders;
};

const page = async () => {
  const orders = await getOrders();

  if (!Array.isArray(orders))
    return (
      <p className="text-red-700">
        <sup>*</sup>You have to be authenticated to see the orders.
      </p>
    );

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Your Orders: </h2>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="p-6 shadow-md bg-white rounded-md">
              <div className="mb-2">
                <h3 className="font-medium">
                  {order.status === "success" ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      SUCCESS
                    </span>
                  ) : order.status === "pending" ? (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                      PENDING
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                      FAILED
                    </span>
                  )}
                  <span className="underline">Ref:</span> {order.id}{" "}
                </h3>
                <h4>
                  <span className="font-medium">on</span>{" "}
                  {moment(order.createdAt, "D/MM/YYYY").toString()}
                  <span className="font-medium">, total:</span>{" "}
                  {order.amount / 100} &euro;
                </h4>
              </div>
              <ul>
                {order.records.map((record) => (
                  <li key={record.id}>
                    <BsDisc className="inline-block align-middle mb-1 mr-1" />
                    <span>{record.name}</span>
                    <span className="font-medium ml-2">
                      ({record.unit_amount} &euro;)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No placed orders.</p>
      )}
    </div>
  );
};

export default page;
