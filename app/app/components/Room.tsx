import Image from "next/image";

type RoomProps = {
  name: string;
  images: string[];
  isOpen: boolean;
  currentRoom: string | null;
  openModal: (roomName: string, images: string[]) => void;
  closeModal: () => void;
  isAdmin: boolean;
};

const Room = ({ name, images, isOpen, currentRoom, openModal, closeModal, isAdmin }: RoomProps) => (
  <div className={isAdmin ? "w-1/5" : "w-1/6"}>
    <Image
      src={images[0]}
      alt={`${name} Room`}
      width={name === "インキュベートルーム" ? 1330 : 500}
      height={name === "インキュベートルーム" ? 886 : 500}
      priority
      onClick={() => openModal(name, images)}
      className="shadow rounded-lg"
    />
    <p className="text-[11px] font-bold mt-2 text-center">{name}</p>
    {isOpen && currentRoom === name && (
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80"
        onClick={closeModal}
      >
        <div className="w-[95%] p-4 rounded-lg flex items-center justify-center relative">
          <div className="flex overflow-x-auto">
            {images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden m-2 w-[600px] h-[600px] relative">
                <Image src={image} alt={`Selected ${index}`} layout="fill" objectFit="contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
export default Room;
