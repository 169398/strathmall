const STKPushQueryLoading = ({ number }: { number: string }) => {
  return (
    <div className="space-y-2 text-center text-black p-10 bg-gray-100">
      <h1 className="animate-pulse">PROCESSING PAYMENT...</h1>
      <h1>STK push sent to {number}</h1>
      <h1>Enter your PIN to confirm payment</h1>
    </div>
  );
};

export default STKPushQueryLoading;
