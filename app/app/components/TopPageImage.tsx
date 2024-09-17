type TopPageImageProps = {
  title: string;
  children?: React.ReactNode;
};

export function TopPageImage({ title, children }: TopPageImageProps) {
  return (
    <div className="border-2 my-4 p-4 bg-white w-11/12  shadow-lg rounded-lg">
      <div className="w-full h-[28rem] bg-black rounded-lg flex">
        <div className="text-white text-left ml-4 sm:ml-10 md:ml-20 lg:ml-30 xl:ml-35">
          <div className="flex items-center mt-8">
            <div>
              <p className="text-yellow-300 font-bold text-7xl">R</p>
            </div>
            <div className="ml-2">
              <p className="text-sm">Conference</p>
              <p className="text-sm">Room</p>
              <p className="text-sm">Reservation</p>
            </div>
          </div>
          <div className="mt-20">
            <p className="font-bold text-xl sm:text-3xl lg:text-5xl">
              W<span className="text-base sm:text-2xl lg:text-4xl">hich</span> Room
            </p>
            <p className="font-bold text-xl sm:text-3xl lg:text-5xl">What Day</p>
            <p className="font-bold text-xl sm:text-3xl lg:text-5xl">What Time</p>
            <p className="text-yellow-300 font-bold text-xl sm:text-3xl lg:text-5xl">{title}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
