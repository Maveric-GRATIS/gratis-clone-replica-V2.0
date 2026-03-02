export default function PartnersTest() {
  console.log("✅ PartnersTest is rendering!");

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ Partners Page Test - WORKING!
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          If you see this, the route is working correctly.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="font-semibold">
            Current Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
