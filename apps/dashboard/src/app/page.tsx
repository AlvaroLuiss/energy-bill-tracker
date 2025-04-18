import { UploadBill } from "@/components/dashboard/upload-bill";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <UploadBill />
        </div>
      </div>
    </div>
  );
}