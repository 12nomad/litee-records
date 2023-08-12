import Image from "next/image";
import Link from "next/link";
import { BsDisc } from "react-icons/bs";

import formatPrice from "../../utils/formatPrice";
import formatAlbum from "../../utils/formatAlbum";
import formatTrack from "../../utils/formatTracks";

interface IRecord {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  currency: string;
  tracks: string;
  description: string | null;
}

const Record = ({
  image,
  name,
  unit_amount,
  id,
  tracks,
  description,
}: IRecord) => {
  const [artist, album] = formatAlbum(name);
  const trackArr = formatTrack(tracks);
  const price = unit_amount ? formatPrice(unit_amount) : "N/A";

  return (
    <Link
      href={{
        pathname: `/records/${id}`,
        query: {
          id,
          name,
          artist,
          album,
          image,
          unit_amount,
          description,
          trackArr,
        },
      }}
    >
      <div className="shadow-md rounded-bl-md rounded-br-md">
        <Image
          src={image}
          alt={name}
          width={224}
          height={224}
          className="rounded-tl-md rounded-tr-md object-cover w-full h-56"
        />
        <div className="p-4 flex justify-between items-end">
          <div>
            <h2 className="font-bold mb-2">{artist}</h2>
            <h3>
              <BsDisc className="inline-block align-middle mb-1" /> {album}
            </h3>
          </div>
          <h2>{price}</h2>
        </div>
      </div>
    </Link>
  );
};

export default Record;
