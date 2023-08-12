"use client";

import Image from "next/image";
import { BsDisc } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { Button, Tooltip } from "flowbite-react";

import useCartStore from "../../../store";
import formatPrice from "../../../utils/formatPrice";

interface ISearchParams {
  params: string;
  searchParams: {
    id: string;
    name: string;
    artist: string;
    album: string;
    unit_amount: number | null;
    image: string;
    currency: string;
    trackArr: string[];
    description: string | null;
  };
}

const RecordDetail = ({ searchParams }: ISearchParams) => {
  const addRecord = useCartStore((s) => s.addRecord);
  const cartItems = useCartStore((s) => s.cartItems);

  const price = searchParams.unit_amount
    ? formatPrice(searchParams.unit_amount)
    : "N/A";

  const onAddRecord = () =>
    addRecord({
      id: searchParams.id,
      artist: searchParams.artist,
      album: searchParams.album,
      image: searchParams.image,
      unit_amount: searchParams.unit_amount
        ? searchParams.unit_amount / 100
        : 0,
    });

  return (
    <div>
      <div className="md:flex gap-6">
        <Image
          src={searchParams.image}
          alt={searchParams.name}
          width={224}
          height={224}
          className="rounded-md object-cover w-56 h-56"
        />
        <div className="mt-2 md:mt-0">
          <ul>
            <li className="font-bold">
              <BsDisc className="inline align-middle mb-1 mr-2" size={20} />
              {searchParams.name}
            </li>
            <li className="max-w-md">{searchParams.description}</li>
          </ul>
          <Button className="mt-4 cursor-auto" color="dark">
            {cartItems.some((el) => el.id === searchParams.id) ? (
              <HiOutlineCheckCircle
                className="inline align-middle mb-[0.1rem] mr-2"
                size={20}
              />
            ) : (
              <Tooltip content="Add To Cart">
                <MdAddCircleOutline
                  className="inline align-middle mb-[0.1rem] mr-2 cursor-pointer"
                  size={20}
                  onClick={onAddRecord}
                />
              </Tooltip>
            )}
            {price}
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-4">Tracks</h2>
      <ul>
        {searchParams.trackArr.map((track, idx) => (
          <li key={idx}>
            {idx + 1} - {track}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordDetail;
